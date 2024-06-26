import { useState } from "react";
import { View } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import CoolText from "./cool-text";
import CoolIcon from "./cool-icon";
import { useAPIStore } from "@/store";

interface ISettingsProp {
  routeKey: number;
  isFirst: boolean;
  isLast: boolean;
  handleEdit: any;
}

export default function Settings({ routeKey, isFirst, isLast, handleEdit }: ISettingsProp) {
  const [ opened, setOpened ] = useState(false);
  const { deleteRoute, moveRouteUp, moveRouteDown } = useAPIStore();

  return (
    <Menu
      opened={opened}
      onBackdropPress={() => setOpened(false)}>
      <MenuTrigger
        onPress={() => setOpened(true)}>
          <CoolIcon iconName={"gear"} onPress={() => setOpened(true)}/>
      </MenuTrigger>
      <MenuOptions customStyles={{ optionsContainer: { width: 180, elevation: 1, borderRadius: 10 } }}>
        <MenuOption onSelect={() => {
          handleEdit();
          setOpened(false);
        }}>
          <View className="flex flex-row justify-start items-center w-full gap-4">
            <CoolIcon iconName="pencil" />
            <CoolText title="Edit" css="p-0 text-lg"/>
          </View>
        </MenuOption>
        <MenuOption onSelect={() => {
          deleteRoute(routeKey);
          setOpened(false);
        }}>
          <View className="flex flex-row justify-start items-center w-full gap-4">
            <CoolIcon iconName="trash" />
            <CoolText title="Delete" css="p-0 text-lg"/>
          </View>
        </MenuOption>
        {!isFirst && <MenuOption onSelect={() => {
          moveRouteUp(routeKey);
          // handleUp();
          setOpened(false);
        }}>
          <View className="flex flex-row justify-start items-center w-full gap-4">
            <CoolIcon iconName="arrow-up" />
            <CoolText title="Move up" css="p-0 text-lg"/>
          </View>
        </MenuOption>}
        {!isLast && <MenuOption onSelect={() => {
          moveRouteDown(routeKey);
          setOpened(false);
        }}>
          <View className="flex flex-row justify-start items-center w-full gap-4">
            <CoolIcon iconName="arrow-down" />
            <CoolText title="Move down" css="p-0 text-lg"/>
          </View>
        </MenuOption>}
      </MenuOptions>
    </Menu>
  );
}
