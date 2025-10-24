import { atom } from "jotai";
import { SuggestCompromisedDevicesInput } from "@/lib/types";

export const aiSensitivityAtom = atom<SuggestCompromisedDevicesInput['sensitivity']>('normal');
