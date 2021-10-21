import firestore from '@react-native-firebase/firestore';
import {MedicationItem, SideEffect} from '../@types/Schema';

export const searchDrugs = async (name: string): Promise<MedicationItem[]> => {
  const drugSearchQuery = firestore()
    .collection('drugs')
    .where('keywords', 'array-contains', name.toLowerCase())
    .limit(5); // limit number of db reads

  // read from cache first to avoid extra db reads
  let snapshot = await drugSearchQuery.get({source: 'cache'});
  if (snapshot.empty) {
    snapshot = await drugSearchQuery.get({source: 'server'});
  }

  // TODO: error handling

  const res = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      genericName: data['generic_name'] as string,
      brandNames: data['brand_names'] as string[],
      description: data['description'] as string[],
      indications: data['indications'] as string[],
      sideEffects: data['side_effects'] as SideEffect[],
    };
  });

  return res;
};
