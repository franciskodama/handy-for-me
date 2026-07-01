import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bomb,
  CornerLeftUp,
  CornerRightDown,
  Trash,
  Trash2,
  ArrowRightLeft,
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DecisionHelperSubject, DecisionHelperProsConsItem } from '@/lib/types';
import { kumbh_sans } from '@/app/ui/fonts';
import {
  addDecisionHelperSubject,
  deleteDecisionHelperSubject,
  addDecisionHelperProsConsItem,
  deleteDecisionHelperProsConsItem,
  toggleDecisionHelperProsConsItemType,
  updateDecisionHelperProsConsItemWeight
} from '@/lib/actions/decision-helper';

export default function ProsConsHelper({
  uid,
  subjects,
  setSubjects,
  allItems,
  setAllItems,
  householdDetails
}: {
  uid: string;
  subjects: DecisionHelperSubject[];
  setSubjects: (s: DecisionHelperSubject[]) => void;
  allItems: DecisionHelperProsConsItem[];
  setAllItems: (i: DecisionHelperProsConsItem[]) => void;
  householdDetails: any;
}) {
  const [subjectId, setSubjectId] = useState<string>(
    subjects.length > 0 ? subjects[0].id : ''
  );
  const [subjectInput, setSubjectInput] = useState<string>('');
  const [pendingNewSubject, setPendingNewSubject] = useState<boolean>(false);

  // Inputs for adding new items
  const [proInput, setProInput] = useState<string>('');
  const [conInput, setConInput] = useState<string>('');
  const [proWeight, setProWeight] = useState<number>(3); // Default weight: medium (3)
  const [conWeight, setConWeight] = useState<number>(3);
  const [pendingProItem, setPendingProItem] = useState<boolean>(false);
  const [pendingConItem, setPendingConItem] = useState<boolean>(false);

  const currentSubject = subjects.find((s) => s.id === subjectId);
  const items = allItems.filter((item) => item.subjectId === subjectId);
  const pros = items.filter((item) => item.isPro);
  const cons = items.filter((item) => !item.isPro);

  // Calculations for the Leaning Bar
  const totalProWeight = pros.reduce((sum, item) => sum + item.weight, 0);
  const totalConWeight = cons.reduce((sum, item) => sum + item.weight, 0);
  const totalWeight = totalProWeight + totalConWeight;
  const proPercentage =
    totalWeight > 0 ? (totalProWeight / totalWeight) * 100 : 50;
  const scoreDiff = totalProWeight - totalConWeight;

  const handleCreateSubject = async () => {
    setPendingNewSubject(true);
    const newSubject = await addDecisionHelperSubject(uid, subjectInput);
    setPendingNewSubject(false);

    if (newSubject) {
      setSubjects([...subjects, newSubject as DecisionHelperSubject]);
      setSubjectId(newSubject.id);
      setSubjectInput('');
      toast({
        title: 'Subject created! 🎯',
        description: `Subject "${subjectInput}" was successfully created.`,
        variant: 'success'
      });
    } else {
      toast({
        title: 'Error adding subject! 🚨',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteSubject = async (id: string) => {
    const success = await deleteDecisionHelperSubject(id);
    if (success) {
      const remainingSubjects = subjects.filter((s) => s.id !== id);
      setSubjects(remainingSubjects);
      setSubjectId(remainingSubjects.length > 0 ? remainingSubjects[0].id : '');
      toast({
        title: 'Subject deleted! 🗑️',
        description: 'Subject and all its pros/cons have been removed.',
        variant: 'success'
      });
    } else {
      toast({
        title: 'Error deleting subject! 🚨',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleAddItem = async (isPro: boolean) => {
    const content = isPro ? proInput : conInput;
    const weight = isPro ? proWeight : conWeight;

    if (isPro) setPendingProItem(true);
    else setPendingConItem(true);

    const newItem = await addDecisionHelperProsConsItem(
      uid,
      subjectId,
      content,
      isPro,
      weight
    );

    if (isPro) setPendingProItem(false);
    else setPendingConItem(false);

    if (newItem) {
      setAllItems([...allItems, newItem as DecisionHelperProsConsItem]);
      if (isPro) {
        setProInput('');
        setProWeight(3);
      } else {
        setConInput('');
        setConWeight(3);
      }
    } else {
      toast({
        title: 'Error adding item! 🚨',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    const success = await deleteDecisionHelperProsConsItem(id);
    if (success) {
      setAllItems(allItems.filter((item) => item.id !== id));
    }
  };

  const handleToggleItemType = async (id: string) => {
    const success = await toggleDecisionHelperProsConsItemType(id);
    if (success) {
      setAllItems(
        allItems.map((item) => {
          if (item.id === id) {
            return { ...item, isPro: !item.isPro };
          }
          return item;
        })
      );
    }
  };

  const handleUpdateWeight = async (id: string, weight: number) => {
    const success = await updateDecisionHelperProsConsItemWeight(id, weight);
    if (success) {
      setAllItems(
        allItems.map((item) => {
          if (item.id === id) {
            return { ...item, weight };
          }
          return item;
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Subject Selector & Creator */}
      <div className="flex flex-col sm:flex-row justify-start gap-8 w-full">
        <div className="flex flex-col gap-4 sm:w-1/2">
          <div className="flex flex-col items-start w-full">
            <p className="text-sm mb-2 font-medium">
              Create a Subject to Analyze:
            </p>
            <div className="flex gap-2 w-full">
              <Input
                placeholder="e.g., have a baby, buy a house..."
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
              />
              <Button
                className={pendingNewSubject ? 'ml-1 bg-primary' : 'ml-1'}
                onClick={handleCreateSubject}
                disabled={pendingNewSubject || subjectInput.trim() === ''}
              >
                {pendingNewSubject ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CornerLeftUp size={18} strokeWidth={1.4} />
              <p className="text-sm">or choose a subject below</p>
              <CornerRightDown size={18} strokeWidth={1.4} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Select
              value={subjectId}
              onValueChange={(value) => {
                setSubjectId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s: DecisionHelperSubject) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <SelectItem value={s.id}>{s.subject}</SelectItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Trash
                            className="text-primary"
                            size={14}
                            strokeWidth={1.4}
                          />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[calc(100%-35px)]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <Bomb size={24} strokeWidth={1.8} />
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="py-4 text-base text-primary">
                            This will permanently delete the subject
                            <span className="font-bold mx-1">
                              "{s.subject}"
                            </span>
                            and all its Pros and Cons.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSubject(s.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {currentSubject ? (
        <div className="flex flex-col gap-8 w-full mt-4">
          {/* Decision Leaning Banner */}
          <div className="w-full border border-primary p-4 shadow-[0_0px_0px_0px_inset,#FFF_-3px_3px_0_-1px,#0F1739_-3px_3px]">
            <p
              className={`${kumbh_sans.className} uppercase font-bold text-lg mb-2 text-center`}
            >
              Decision Balance: {currentSubject.subject}
            </p>
            {/* Visual Gauge Container */}
            <div className="relative w-full h-8 bg-rose-500 border border-primary overflow-hidden mb-2">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 ease-out border-r border-primary"
                style={{ width: `${proPercentage}%` }}
              />
              <div className="absolute top-0 bottom-0 left-1/2 -ml-px border-l-2 border-dashed border-black z-10" />
            </div>

            <div className="flex justify-between items-center text-xs font-bold uppercase mt-1 px-1">
              <span className="text-emerald-600">
                Pros Total Weight: {totalProWeight}
              </span>
              <span className="text-center text-sm font-extrabold text-primary">
                {scoreDiff > 0 ? (
                  <span className="text-emerald-600">
                    Leaning Pro (+{scoreDiff})
                  </span>
                ) : scoreDiff < 0 ? (
                  <span className="text-rose-600">
                    Leaning Con ({scoreDiff})
                  </span>
                ) : totalWeight > 0 ? (
                  <span className="text-gray-500">
                    Perfectly Balanced (50/50)
                  </span>
                ) : (
                  <span className="text-gray-400 font-normal">
                    Add items to weigh decision
                  </span>
                )}
              </span>
              <span className="text-rose-600">
                Cons Total Weight: {totalConWeight}
              </span>
            </div>
          </div>

          {/* Pros and Cons Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PROS COLUMN */}
            <Card className="border border-emerald-500 shadow-[-3px_3px_0px_0px_#10b981] md:shadow-[-4px_4px_0px_0px_#10b981]">
              <CardHeader className="bg-emerald-50/50 border-b border-emerald-200">
                <CardTitle className="text-emerald-700 text-2xl">
                  Pros
                </CardTitle>
                <CardDescription>Reasons to do this decision</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col gap-4">
                {/* Form to add Pro */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a pro point..."
                      value={proInput}
                      onChange={(e) => setProInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && proInput.trim() !== '') {
                          handleAddItem(true);
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleAddItem(true)}
                      disabled={pendingProItem || proInput.trim() === ''}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-muted-foreground">
                      Weight:
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((w) => (
                        <button
                          key={w}
                          onClick={() => setProWeight(w)}
                          className={`w-6 h-6 border font-bold flex items-center justify-center transition-all ${
                            proWeight === w
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-background hover:bg-muted border-primary'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-1">
                      (1 = low, 5 = critical)
                    </span>
                  </div>
                </div>

                {/* Pros List */}
                <div className="flex flex-col gap-2 mt-2">
                  <AnimatePresence>
                    {pros.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between text-sm w-full border border-emerald-300 p-2 gap-2 bg-emerald-50/20"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="font-medium">{item.content}</p>
                          {householdDetails?.inHousehold &&
                            householdDetails?.userSettings
                              ?.shareDecisionHelper && (
                              <span className="text-[9px] text-muted-foreground bg-muted px-1 py-0.5 rounded w-max">
                                by {item.uid.split('@')[0]}
                              </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          {/* Inline Weight Pills selector */}
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((w) => (
                              <button
                                key={w}
                                onClick={() => handleUpdateWeight(item.id, w)}
                                className={`w-5 h-5 text-[10px] font-bold border flex items-center justify-center transition-all ${
                                  item.weight === w
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-background hover:bg-muted border-emerald-200'
                                }`}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 border-l border-emerald-200 pl-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
                              title="Move to Cons"
                              onClick={() => handleToggleItemType(item.id)}
                            >
                              <ArrowRightLeft size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {pros.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No pros added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CONS COLUMN */}
            <Card className="border border-rose-500 shadow-[-3px_3px_0px_0px_#f43f5e] md:shadow-[-4px_4px_0px_0px_#f43f5e]">
              <CardHeader className="bg-rose-50/50 border-b border-rose-200">
                <CardTitle className="text-rose-700 text-2xl">Cons</CardTitle>
                <CardDescription>
                  Reasons against doing this decision
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col gap-4">
                {/* Form to add Con */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a con point..."
                      value={conInput}
                      onChange={(e) => setConInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && conInput.trim() !== '') {
                          handleAddItem(false);
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleAddItem(false)}
                      disabled={pendingConItem || conInput.trim() === ''}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-muted-foreground">
                      Weight:
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((w) => (
                        <button
                          key={w}
                          onClick={() => setConWeight(w)}
                          className={`w-6 h-6 border font-bold flex items-center justify-center transition-all ${
                            conWeight === w
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-background hover:bg-muted border-primary'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-1">
                      (1 = low, 5 = critical)
                    </span>
                  </div>
                </div>

                {/* Cons List */}
                <div className="flex flex-col gap-2 mt-2">
                  <AnimatePresence>
                    {cons.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between text-sm w-full border border-rose-300 p-2 gap-2 bg-rose-50/20"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="font-medium">{item.content}</p>
                          {householdDetails?.inHousehold &&
                            householdDetails?.userSettings
                              ?.shareDecisionHelper && (
                              <span className="text-[9px] text-muted-foreground bg-muted px-1 py-0.5 rounded w-max">
                                by {item.uid.split('@')[0]}
                              </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          {/* Inline Weight Pills selector */}
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((w) => (
                              <button
                                key={w}
                                onClick={() => handleUpdateWeight(item.id, w)}
                                className={`w-5 h-5 text-[10px] font-bold border flex items-center justify-center transition-all ${
                                  item.weight === w
                                    ? 'bg-rose-600 text-white border-rose-600'
                                    : 'bg-background hover:bg-muted border-rose-200'
                                }`}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 border-l border-rose-200 pl-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-rose-700 hover:text-rose-900 hover:bg-rose-100"
                              title="Move to Pros"
                              onClick={() => handleToggleItemType(item.id)}
                            >
                              <ArrowRightLeft size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {cons.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No cons added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="stripe-border flex flex-col items-center justify-center p-12 mt-8 mb-8 text-center text-muted-foreground">
          <p className="font-bold mb-2">No Subject Selected</p>
          <p className="text-sm">
            Create a new subject or choose an existing one from the dropdown to
            start your Pros and Cons Analysis.
          </p>
        </div>
      )}
    </div>
  );
}
