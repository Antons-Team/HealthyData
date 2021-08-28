import { NavigatorScreenParams } from "@react-navigation/native";
import { RootStackParamList } from "./RootStackParams";
import { MedicationItem } from "./Schema";

export type MedicationsStackParamList = {
    MedicationsNavigation: NavigatorScreenParams<RootStackParamList>;
    Medications: undefined;
    AddMedication: {medication: MedicationItem};
    AddMedicationInfo: undefined;
};