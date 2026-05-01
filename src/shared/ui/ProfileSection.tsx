import { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { cn } from "../utils/cn";

type IconName = keyof typeof Ionicons.glyphMap;

interface ProfileHeaderCardProps {
  email?: string | null;
  fallbackName: string;
  fallbackInitial: string;
  badgeText: string;
  avatarClassName: string;
  avatarTextClassName: string;
  badgeClassName: string;
  badgeTextClassName: string;
}

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
}

interface ProfileItemProps {
  icon: IconName;
  label: string;
  value?: string;
  subtitle?: string;
  onPress?: () => void;
  isLink?: boolean;
  isDanger?: boolean;
  showDivider?: boolean;
  iconBgClassName?: string;
  iconColor?: string;
}

interface ProfileAccountSectionProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
  iconBgClassName?: string;
  iconColor?: string;
}

export function ProfileHeaderCard({
  email,
  fallbackName,
  fallbackInitial,
  badgeText,
  avatarClassName,
  avatarTextClassName,
  badgeClassName,
  badgeTextClassName,
}: ProfileHeaderCardProps) {
  return (
    <Card className="items-center p-6 bg-white">
      <View
        className={cn(
          "w-20 h-20 rounded-full items-center justify-center mb-3 border-2",
          avatarClassName,
        )}
      >
        <Text className={cn("text-3xl font-bold", avatarTextClassName)}>
          {email ? email.charAt(0).toUpperCase() : fallbackInitial}
        </Text>
      </View>

      <Text
        numberOfLines={1}
        ellipsizeMode="middle"
        className="text-lg font-bold text-text-main mb-1 max-w-full"
      >
        {email || fallbackName}
      </Text>

      <View className={cn("px-3 py-1 rounded-full border", badgeClassName)}>
        <Text className={cn("text-xs font-bold uppercase", badgeTextClassName)}>
          {badgeText}
        </Text>
      </View>
    </Card>
  );
}

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <Card className="p-0 px-4">
      <Text className="text-sm font-bold text-text-muted mt-4 mb-2 uppercase">
        {title}
      </Text>

      {children}
    </Card>
  );
}

export function ProfileItem({
  icon,
  label,
  value,
  subtitle,
  onPress,
  isLink = false,
  isDanger = false,
  showDivider = true,
  iconBgClassName = "bg-primary/10",
  iconColor = "#6C63FF",
}: ProfileItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      className={cn(
        "flex-row items-center py-3",
        showDivider && "border-b border-gray-100",
        onPress ? "active:opacity-70" : "",
      )}
    >
      <View
        className={cn(
          "w-8 h-8 rounded-full items-center justify-center mr-3",
          isDanger ? "bg-red-50" : iconBgClassName,
        )}
      >
        <Ionicons
          name={icon}
          size={18}
          color={isDanger ? "#DC2626" : iconColor}
        />
      </View>

      <View className="flex-1 min-w-0">
        <Text
          numberOfLines={1}
          className={cn(
            "font-medium",
            isDanger ? "text-red-600" : "text-text-main",
          )}
        >
          {label}
        </Text>

        {subtitle && (
          <Text
            numberOfLines={1}
            className={cn(
              "text-xs mt-0.5",
              isDanger ? "text-red-400" : "text-text-muted",
            )}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View className="flex-row items-center ml-2">
        {value && (
          <Text
            className="text-text-muted text-sm mr-2 max-w-[150px]"
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {value}
          </Text>
        )}

        {isLink && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDanger ? "#FCA5A5" : "#9CA3AF"}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export function ProfileAccountSection({
  onLogout,
  onDeleteAccount,
  iconBgClassName = "bg-primary/10",
  iconColor = "#6C63FF",
}: ProfileAccountSectionProps) {
  return (
    <ProfileSection title="Акаунт">
      <ProfileItem
        icon="log-out-outline"
        label="Вийти з акаунту"
        isLink
        onPress={onLogout}
        iconBgClassName={iconBgClassName}
        iconColor={iconColor}
      />

      <ProfileItem
        icon="trash-outline"
        label="Видалити акаунт"
        subtitle="Незворотна дія"
        isLink
        isDanger
        showDivider={false}
        onPress={onDeleteAccount}
      />
    </ProfileSection>
  );
}
