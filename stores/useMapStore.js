import create from 'zustand';

const useMapStore = create((set) => ({
  map: null,
  smallMap: null,
  populateMap: (mapGenerated) => set((state) => ({ map: mapGenerated })),
  populateSmallMap: (mapGenerated) =>
    set((state) => ({ smallMap: mapGenerated })),
  removeMap: () => set({ map: null }),
  removeSmallMap: () => set({ smallMap: null }),
}));

export default useMapStore;
