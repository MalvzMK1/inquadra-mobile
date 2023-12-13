import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import SportItem from "../SportItem";
const iconFutebol = require("./icons/iconFutebol.png");
const iconVoley = require("./icons/iconVoley.png");
const iconBasquete = require("./icons/iconBasquete.png");
const iconBTennis = require("./icons/iconBTennis.png");
const iconTennis = require("./icons/iconTennis.png");
const iconFVoley = require("./icons/iconFVoley.png");
const activeIconFutebol = require("./icons/activeIconFutebol.png");
const activeIconVoley = require("./icons/activeIconVoley.png");
const activeIconBasquete = require("./icons/activeIconBasquete.png");
const activeIconBTennis = require("./icons/activeIconBTennis.png");
const activeIconTennis = require("./icons/activeIconTennis.png");
const activeIconFVoley = require("./icons/activeIconFVoley.png");

const arrayIcons = [
  {
    id: 1,
    image: iconFutebol,
    activeImage: activeIconFutebol,
  },
  {
    id: 4,
    image: iconBasquete,
    activeImage: activeIconBasquete,
  },
  {
    id: 6,
    image: iconTennis,
    activeImage: activeIconTennis,
  },
  {
    id: 5,
    image: iconBTennis,
    activeImage: activeIconBTennis,
  },
  {
    id: 7,
    image: iconVoley,
    activeImage: activeIconVoley,
  },
  {
    id: 3,
    image: iconFutebol,
    activeImage: activeIconFutebol,
  },
  {
    id: 2,
    image: iconFVoley,
    activeImage: activeIconFVoley,
  },
];

interface ISportsMenuProps {
  sports: SportType[];
  callBack: Function;
  sportSelected: string | undefined;
}

export default function SportsMenu({
  sports,
  callBack,
  sportSelected,
}: ISportsMenuProps) {
  const [selected, setSelected] = useState<string>();

  return (
    <>
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        className="bg-neutral-200 flex w-full h-[9%] px-3 shadow-lg"
        style={{
          shadowColor: "black",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}
      >
        <FlatList
          data={sports}
          keyExtractor={item => item.id}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              className="justify-center items-center pr-4"
              key={item.id}
              onPress={() => {
                if (selected === item.id) {
                  callBack(undefined);
                  setSelected(undefined);
                } else {
                  callBack(item.name);
                  setSelected(item.id);
                }
              }}
            >
              {selected !== item.id ? (
                <SportItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image={arrayIcons[parseInt(item.id) - 1].image}
                />
              ) : (
                <SportItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image={arrayIcons[parseInt(item.id) - 1].activeImage}
                />
              )}
            </TouchableOpacity>
          )}
        ></FlatList>
      </Animated.View>
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        className="w-full h-[3px] bg-gradient-to-b from-neutral-700 via-neutral-900 to-black"
      />
    </>
  );
}
