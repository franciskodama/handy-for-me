import { auth } from '@/lib/auth';
import { getVisitedPlaces } from '@/lib/actions/visited-places';
import AtlasView from './atlas-view';
import SignInPrompt from '@/components/SignInPrompt';

export default async function AtlasPage() {
  const session = await auth();
  const uid = session?.user?.email;

  if (!uid) {
    return <SignInPrompt />;
  }

  let places: any[] = [];
  const res = await getVisitedPlaces(uid);
  if (res.success && Array.isArray(res.data)) {
    places = res.data;
  }

  return (
    <AtlasView
      uid={uid}
      initialPlaces={places}
    />
  );
}
