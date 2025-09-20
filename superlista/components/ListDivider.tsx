import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DividerProps {
  text: string;
}

export const ListDivider: React.FC<DividerProps> = ({ text }) => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{text}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    marginHorizontal: 16,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
  },
});
