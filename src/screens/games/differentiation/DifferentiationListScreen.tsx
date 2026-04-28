// // src\screens\games\differentiation\DifferentiationListScreen.tsx
// import React from "react";
// import { Text, View, TouchableOpacity } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { Screen } from "../../../shared/ui/Screen";
// import type { GamesStackParamList } from "../../../navigation/games/GamesStack";
// import { Ionicons } from "@expo/vector-icons";

// type Props = NativeStackScreenProps<GamesStackParamList, "DifferentiationList">;

// export function DifferentiationListScreen({ navigation }: Props) {
//   return (
//     <Screen>
//       <View className="flex-row items-center px-6 pt-2 pb-4">
//         <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
//           <Ionicons name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
//         <View>
//           <Text className="text-text-muted text-xs uppercase font-bold tracking-widest">
//             Диференціація
//           </Text>
//           <Text className="text-2xl font-bold text-primary">Звуки</Text>
//         </View>
//       </View>

//       <View className="flex-1 justify-center items-center px-6">
//         <Text className="text-xl text-center">
//           Тут буде реалізований розділ диференціації звуків
//         </Text>
//       </View>
//     </Screen>
//   );
// }
