import { createContext, useState } from 'react'

import AppHeader from 'src/components/AppHeader/AppHeader'
import AppSidebar from 'src/components/AppSidebar/AppSidebar'

type AppLayoutProps = {
  children?: React.ReactNode
}

export const SidebarContext = createContext<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isOpen: false,
  setIsOpen: () => null,
})

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  return (
    <div className="flex h-screen w-screen">
      <AppSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="h-screen w-screen">
        <SidebarContext.Provider
          value={{
            isOpen: isSidebarOpen,
            setIsOpen: setIsSidebarOpen,
          }}
        >
          <AppHeader />
          {children}
        </SidebarContext.Provider>
      </div>
    </div>
  )
}

export default AppLayout
