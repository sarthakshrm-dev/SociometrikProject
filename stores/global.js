import create from "zustand";

const globalStore = create((set) => ({
    userPermission: null,
    uploadIsOpen: false,
    catchmentIsOpen: false,
    tradeArea: 0,
    setUserPermission: (val) => set((state) => ({ userPermission: val})),
    setUploadIsOpen: (val) => set((state) => ({ uploadIsOpen: val})),
    setCatchmentIsOpen: (val) => set((state) => ({ catchmentIsOpen: val})),
    setTradeArea: (val) => set((state) => ({ tradeArea: val}))
}))

export default globalStore;