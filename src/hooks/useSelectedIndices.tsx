import { useState } from 'react';

type Dispatch = React.Dispatch<React.SetStateAction<Set<number>>>;
type SelectedIndicesHook = [Set<number>, ((i: number) => void), Dispatch]

const useSelectedIndices = (initialSelectedIndices = new Set<number>()) => {
  const [selectedIndices, setSelectedIndices] = (
    useState<Set<number>>(initialSelectedIndices)
  );

  const toggleIndex = (index: number) => {
    setSelectedIndices(state => {
      const newIndices = new Set(state);
      if (newIndices.has(index)) {
        newIndices.delete(index);
      } else {
        newIndices.add(index);
      }
      return newIndices;
    });
  };

  return (
    [selectedIndices, toggleIndex, setSelectedIndices] as SelectedIndicesHook
  );
}

export default useSelectedIndices;
