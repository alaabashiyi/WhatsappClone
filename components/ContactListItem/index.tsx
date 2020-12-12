import React from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { ChatRoom, User } from "../../types";
import styles from "./style";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

import { API, graphqlOperation, Auth } from "aws-amplify";
import { createChatRoom, createChatRoomUser } from "../../graphql/mutations";

export type ContactListItemProps = {
  user: User;
};

const ContactListItem = (props: ContactListItemProps) => {
  const { user } = props;
  const userImage =
    user.imageUr === null
      ? `https://randomuser.me/api/portraits/women/50.jpg`
      : user.imageUr;

  const navigation = useNavigation();

  const onClick = async () => {
    try {
      // 1. Create a new chatroom
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChatRoom, {
          input: {},
        })
      );

      if (!newChatRoomData.data) {
        console.log("Failed to create chatroom");
        return;
      }

      const newChatRoom = newChatRoomData.data.createChatRoom;
      // 2. Add user to the chatroom

      await API.graphql(
        graphqlOperation(createChatRoomUser, {
          input: {
            userID: user.id,
            chatRoomID: newChatRoom.id,
          },
        })
      );

      // 3. Add authenticated user to the chatroom

      const userInfo = await Auth.currentAuthenticatedUser();

      await API.graphql(
        graphqlOperation(createChatRoomUser, {
          input: {
            userID: userInfo.attributes.sub,
            chatRoomID: newChatRoom.id,
          },
        })
      );

      navigation.navigate("ChatRoom", {
        id: newChatRoom.id,
        name: "Hardcoded name",
        // imageUr: userInfo.imageUr,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image
            source={{
              uri: userImage,
            }}
            style={styles.avatar}
          />
          <View style={styles.midContainer}>
            <Text style={styles.username}>{user.name}</Text>
            <Text
              numberOfLines={1}
              style={styles.status}
              ellipsizeMode={"tail"}
            >
              {user.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContactListItem;
