import React from 'react';
import { View, ViewProps } from 'react-native';

interface NeobrutalistCardProps extends ViewProps {
  children: React.ReactNode;
  containerClassName?: string;
  cardClassName?: string;
  shadowColor?: string; // Tailwind bg class for the shadow layer (e.g. bg-primary, bg-[#DDF906])
  borderColor?: string; // Tailwind border class (e.g. border-primary)
}

export function NeobrutalistCard({
  children,
  containerClassName = '',
  cardClassName = '',
  shadowColor = 'bg-primary',
  borderColor = 'border-primary',
  ...props
}: NeobrutalistCardProps) {
  return (
    <View className={`relative ${containerClassName}`} {...props}>
      {/* Flat Solid 3D Shadow Layer */}
      <View className={`absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] border-2 ${borderColor} ${shadowColor} rounded-none`} />
      {/* Main Foreground Card Layer */}
      <View className={`bg-white border-2 ${borderColor} p-5 rounded-none ${cardClassName}`}>
        {children}
      </View>
    </View>
  );
}
