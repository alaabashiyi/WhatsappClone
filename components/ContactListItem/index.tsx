import React from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { ChatRoom, User } from "../../types";
import styles from "./style";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

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

  const onClick = () => {};

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
