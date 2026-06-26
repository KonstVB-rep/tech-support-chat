import { SIDEBAR_TYPES, SidebarTypes } from '@/widgets/types'
import React from 'react'
import { SelectedScreen } from './SelectedScreen'

type ScreenByTypeProps = {
    screenType: SidebarTypes,
}

const ScreenByType = ({screenType}: ScreenByTypeProps) => {
  return (
    <>
        {screenType === SIDEBAR_TYPES.CHATS && <SelectedScreen.ChatWindow />}
        {screenType === SIDEBAR_TYPES.SETTINGS && <SelectedScreen.SettingsWindow />}
    </>
  )
}

export default ScreenByType