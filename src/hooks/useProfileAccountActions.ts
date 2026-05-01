import { Alert } from "react-native";
import { useAuthStore } from "../store/authStore";

export function useProfileAccountActions() {
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

  const handleLogout = () => {
    Alert.alert("Вихід", "Ви дійсно хочете вийти з акаунту?", [
      { text: "Скасувати", style: "cancel" },
      { text: "Вийти", style: "destructive", onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Видалити акаунт",
      "Ви дійсно хочете видалити акаунт? Всі дані будуть втрачені назавжди.",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
            } catch {
              Alert.alert(
                "Помилка",
                "Не вдалося видалити акаунт. Спробуйте пізніше.",
              );
            }
          },
        },
      ],
    );
  };

  return {
    handleLogout,
    handleDeleteAccount,
  };
}
