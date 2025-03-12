import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type BreadcrumbType = {
  label: string,
  link?: string,
  type?:'page'|'nav',
}
interface UIstate {
  preloader: {
    status: boolean,
    message: string
  },
  breadCrumb: BreadcrumbType[],
  searchText:string|null,
}

const initialState: UIstate = {
  preloader: { status: false, message: '' },
  breadCrumb: [
    { label: 'Dashboard', link: '/dashboard' }
  ],
  searchText: null,
}

export const uiSlice = createSlice({
  name: 'UIstates',
  initialState,
  reducers: {
    showLoader: (state, action: PayloadAction<string>) => ({ ...state, preloader: { status: true, message: action.payload } }),
    hideLoader: (state) => ({ ...state, preloader: { status: false, message: '' } }),
    addBredcrumb: (state, action: PayloadAction<BreadcrumbType>) => ({ ...state, breadCrumb: [...state.breadCrumb, action.payload] }),
    removeBredcrumb: (state, action: PayloadAction<BreadcrumbType>) => ({ ...state, breadCrumb: state.breadCrumb.filter(b => b.link != action.payload.link) }),
    setBreadcrumb: (state, action: PayloadAction<BreadcrumbType[]>) => ({ ...state, breadCrumb: action.payload }),
    setSearchText: (state, action: PayloadAction<string | null>) => {
      return {...state,searchText:action.payload}
    }
  },
})

export const { showLoader, hideLoader, addBredcrumb, removeBredcrumb, setBreadcrumb,setSearchText } = uiSlice.actions
export default uiSlice.reducer