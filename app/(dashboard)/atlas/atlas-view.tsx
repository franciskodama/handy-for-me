'use client';

import { useState, useTransition, useRef } from 'react';
import dynamic from 'next/dynamic';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { addVisitedPlace, deleteVisitedPlace, searchCities } from '@/lib/actions/visited-places';
import { getContinentByCountry } from '@/lib/continents';
import { MapPin, Globe, Award, Sparkles, Trash2, Calendar, BookOpen, Compass, Search } from 'lucide-react';
import { barlow, kumbh_sans } from '@/app/ui/fonts';

// Load Leaflet map component dynamically to avoid SSR errors
const MapComponent = dynamic(() => import('@/components/atlas/map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-lg border bg-muted flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Compass className="h-8 w-8 text-primary animate-spin" />
        <span className="text-sm text-muted-foreground font-medium">Loading Map...</span>
      </div>
    </div>
  )
});

interface Place {
  id: string;
  city: string;
  state: string | null;
  country: string;
  lat: number;
  lng: number;
  notes: string | null;
  visitDate: Date | null;
}

interface AtlasViewProps {
  uid: string;
  initialPlaces: Place[];
}

export default function AtlasView({ uid, initialPlaces }: AtlasViewProps) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('');
  const [notes, setNotes] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<Array<{ name: string; country: string; state: string }>>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const datePickerRef = useRef<HTMLInputElement>(null);

  const getValidDateValue = (val: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return val;
      }
    }
    return '';
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    if (searchTimeout) clearTimeout(searchTimeout);

    if (val.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await searchCities(val);
        setSuggestions(res);
      } catch (err) {
        console.error('Error fetching city suggestions:', err);
      }
    }, 150);
    setSearchTimeout(timeout);
  };

  const handleVisitDateChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    let formatted = '';
    if (clean.length <= 4) {
      formatted = clean;
    } else if (clean.length <= 6) {
      formatted = `${clean.slice(0, 4)}-${clean.slice(4)}`;
    } else {
      formatted = `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
    }
    setVisitDate(formatted);
  };

  // Statistics calculation
  const totalCities = places.length;
  
  const uniqueCountries = Array.from(
    new Set(places.map((p) => p.country.trim().toLowerCase()))
  );
  const totalCountriesCount = uniqueCountries.length;
  const worldCountriesCount = 195;
  const countriesPercentage = ((totalCountriesCount / worldCountriesCount) * 100).toFixed(1);

  // Continent statistics
  const continents = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania', 'Antarctica'];
  const visitedContinents = Array.from(
    new Set(places.map((p) => getContinentByCountry(p.country)))
  );
  const continentsCount = visitedContinents.length;

  // Badges eligibility
  const badges = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Pin your very first visited city',
      unlocked: totalCities >= 1,
      icon: <MapPin className="h-5 w-5" />
    },
    {
      id: 'explorer',
      name: 'Avid Explorer',
      description: 'Visit 5 or more unique countries',
      unlocked: totalCountriesCount >= 5,
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: 'globetrotter',
      name: 'Globetrotter',
      description: 'Visit 10 or more unique countries',
      unlocked: totalCountriesCount >= 10,
      icon: <Compass className="h-5 w-5" />
    },
    {
      id: 'cross-continental',
      name: 'Cross Continental',
      description: 'Visit 3 or more continents',
      unlocked: continentsCount >= 3,
      icon: <Award className="h-5 w-5" />
    },
    {
      id: 'historian',
      name: 'Historian',
      description: 'Add a memory or note to a visited city',
      unlocked: places.some((p) => p.notes && p.notes.trim().length > 0),
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  // Form Submission
  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !country.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'City and Country are required.'
      });
      return;
    }

    if (visitDate) {
      const parsedDate = new Date(visitDate);
      const year = parsedDate.getFullYear();
      if (isNaN(parsedDate.getTime()) || year < 1000 || year > 9999) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please enter a valid visit date with a 4-digit year.'
        });
        return;
      }
    }

    startTransition(async () => {
      const res = await addVisitedPlace({
        uid,
        city: city.trim(),
        state: stateName.trim() || undefined,
        country: country.trim(),
        notes: notes.trim() || undefined,
        visitDate: visitDate || null
      });

      if (res.success && res.data) {
        // cast because of Date serialization
        const newPlace: Place = {
          ...res.data,
          visitDate: res.data.visitDate ? new Date(res.data.visitDate) : null
        };
        setPlaces((prev) => [newPlace, ...prev]);
        toast({
          title: 'Success!',
          description: `Pinned ${newPlace.city} to your Atlas.`
        });
        
        // Reset form
        setCity('');
        setStateName('');
        setCountry('');
        setNotes('');
        setVisitDate('');
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to add place',
          description: res.error || 'Check spelling and try again.'
        });
      }
    });
  };

  // Delete Place
  const handleDeletePlace = async (id: string) => {
    const res = await deleteVisitedPlace(id);
    if (res.success) {
      setPlaces((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: 'Removed',
        description: 'Pin successfully removed from your Atlas.'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: res.error || 'Failed to remove pin.'
      });
    }
  };

  // Filtered places for list view
  const filteredPlaces = places.filter((place) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      place.city.toLowerCase().includes(searchLower) ||
      place.country.toLowerCase().includes(searchLower) ||
      (place.state && place.state.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 relative gap-4 w-full">
        <div className="flex flex-col">
          <h1 className={`${kumbh_sans.className} text-primary uppercase font-bold text-3xl leading-none`}>
            Atlas
          </h1>
          <p className={`${barlow.className} text-sm font-normal lowercase mt-2`}>
            <span className="uppercase">M</span>ap the footsteps of your lifetime. pin cities you've visited, save memories, and track your global footprint.
          </p>
        </div>
      </div>

      {/* Stats Cards Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Cities Visited</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <MapPin className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCities}</div>
            <p className="text-xs text-muted-foreground mt-1">Different spots pinned on your map</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-card to-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Countries Visited</CardTitle>
            <div className="p-2 bg-cyan-500/10 rounded-full text-cyan-500">
              <Globe className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{totalCountriesCount}</span>
              <span className="text-sm text-muted-foreground">/ {worldCountriesCount}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(parseFloat(countriesPercentage), 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{countriesPercentage}% of the world explored</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-card to-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Continents Pinned</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-full text-amber-500">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{continentsCount} <span className="text-sm font-medium text-muted-foreground">/ 7</span></div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {continents.map((continent) => {
                const visited = visitedContinents.includes(continent);
                return (
                  <Badge 
                    key={continent} 
                    variant={visited ? "default" : "outline"}
                    className={`text-[9px] px-1.5 py-0.5 transition-colors ${
                      visited 
                        ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                        : 'text-muted-foreground border-dashed bg-transparent'
                    }`}
                  >
                    {continent}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Form and Badges */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Add visited place Form */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Add New Memory</CardTitle>
              <CardDescription>Enter a city name and country to pin it on your map.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPlace} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 relative">
                  <label htmlFor="city" className="text-xs font-semibold">City *</label>
                  <div className="relative">
                    <Input
                      id="city"
                      placeholder="e.g., Paris, Tokyo, Sydney"
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                      required
                      disabled={isPending}
                      className="focus-visible:ring-primary"
                      autoComplete="off"
                    />
                    {isFocused && suggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-lg max-h-60 overflow-y-auto animate-in fade-in-50 slide-in-from-top-1 duration-200">
                        {suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onMouseDown={() => {
                              setCity(suggestion.name);
                              if (suggestion.state && suggestion.state !== 'N/A') {
                                setStateName(suggestion.state);
                              } else {
                                setStateName('');
                              }
                              setCountry(suggestion.country);
                              setSuggestions([]);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors flex flex-col border-b last:border-b-0 border-muted"
                          >
                            <span className="font-semibold text-xs text-foreground">{suggestion.name}</span>
                            <span className="text-[10px] text-muted-foreground font-normal">
                              {suggestion.state && suggestion.state !== 'N/A' ? `${suggestion.state}, ` : ''}{suggestion.country}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="state" className="text-xs font-semibold">State / Province (Optional)</label>
                  <Input
                    id="state"
                    placeholder="e.g., Île-de-France, New York"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    disabled={isPending}
                    className="focus-visible:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="country" className="text-xs font-semibold">Country *</label>
                  <Input
                    id="country"
                    placeholder="e.g., France, Japan, Australia"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    disabled={isPending}
                    className="focus-visible:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="visitDate" className="text-xs font-semibold">Date of Visit (Optional)</label>
                  <div className="relative">
                    <Input
                      id="visitDate"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={visitDate}
                      onChange={(e) => handleVisitDateChange(e.target.value)}
                      disabled={isPending}
                      className="focus-visible:ring-primary text-sm font-mono pr-10"
                      maxLength={10}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          datePickerRef.current?.showPicker();
                        } catch (e) {
                          console.error('showPicker not supported or failed:', e);
                        }
                      }}
                      disabled={isPending}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none disabled:opacity-50"
                      title="Choose date from calendar"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                    <input
                      type="date"
                      ref={datePickerRef}
                      value={getValidDateValue(visitDate)}
                      onChange={(e) => setVisitDate(e.target.value)}
                      disabled={isPending}
                      className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
                      tabIndex={-1}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="notes" className="text-xs font-semibold">Travel Notes & Memories (Optional)</label>
                  <textarea
                    id="notes"
                    placeholder="Describe your memories, places you ate, or general feelings..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isPending}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <Button type="submit" disabled={isPending} className="w-full mt-2 font-medium">
                  {isPending ? 'Searching & Pinning...' : 'Add to Atlas'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Travel Badges */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-1.5">
                <Award className="h-5 w-5 text-amber-500" />
                Travel Milestones
              </CardTitle>
              <CardDescription>Earn achievements as you explore the globe.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
                    badge.unlocked 
                      ? 'bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/20' 
                      : 'bg-muted/30 border-muted opacity-60'
                  }`}
                >
                  <div className={`p-2 rounded-full border ${
                    badge.unlocked 
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                      : 'bg-muted border-muted text-muted-foreground'
                  }`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className={`text-sm font-semibold truncate ${
                        badge.unlocked ? 'text-slate-900 dark:text-slate-100' : 'text-muted-foreground'
                      }`}>
                        {badge.name}
                      </h4>
                      {badge.unlocked && (
                        <Badge variant="secondary" className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-none text-[9px] h-4 px-1.5">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Right Hand: Map and List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Dynamic Map Component */}
          <div className="relative">
            <MapComponent 
              places={places} 
              onDeletePlaceAction={handleDeletePlace} 
            />
          </div>

          {/* List of Pinned Places */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Your Travel Log</CardTitle>
                <CardDescription>Browse and search places you've visited.</CardDescription>
              </div>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cities/countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredPlaces.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg bg-muted/20">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {searchQuery ? 'No matching places found.' : "No places added to your Atlas yet."}
                  </p>
                  {!searchQuery && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Start by adding a city on the left!
                    </p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="p-3">Location</th>
                        <th className="p-3">Continent</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Notes</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredPlaces.map((place) => {
                        const dateStr = place.visitDate
                          ? new Date(place.visitDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : '—';

                        return (
                          <tr key={place.id} className="hover:bg-muted/30 transition-colors group">
                            <td className="p-3 font-semibold text-foreground">
                              {place.city}
                              {place.state && <span className="text-xs font-normal text-muted-foreground">, {place.state}</span>}
                              <div className="text-xs text-muted-foreground font-normal">{place.country}</div>
                            </td>
                            <td className="p-3">
                              <Badge variant="outline" className="text-xs font-normal">
                                {getContinentByCountry(place.country)}
                              </Badge>
                            </td>
                            <td className="p-3 text-muted-foreground flex items-center gap-1.5 mt-1.5 text-xs">
                              <Calendar className="h-3.5 w-3.5" />
                              {dateStr}
                            </td>
                            <td className="p-3 max-w-[200px] truncate text-xs text-muted-foreground italic" title={place.notes || undefined}>
                              {place.notes || '—'}
                            </td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePlace(place.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-80 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
