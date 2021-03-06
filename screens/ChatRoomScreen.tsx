import React, { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useRoute } from "@react-navigation/native";

import ChatMessage from "../components/ChatMessage";
import BG from "../assets/images/BG.png";
import InputBox from "../components/InputBox";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { messagesByChatRoom } from "../graphql/queries";
import { onCreateMessage } from "../graphql/subscriptions";

const ChatRoomScreen = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);

  const fetchMessages = async () => {
    const messagesData = await API.graphql(
      graphqlOperation(messagesByChatRoom, {
        chatRoomID: route.params.id,
        sortDirection: "DESC",
      })
    );

    setMessages(messagesData.data.messagesByChatRoom.items);
  };

  useEffect(() => {
    fetchMessages();
  });

  useEffect(() => {
    const getMyId = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();

      setMyId(userInfo.attributes.sub);
    };

    getMyId();
  });

  // CHALLENGE
  // subscribe to new messages only in the chatroom
  // subscribe to ChatRoom updates

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (data) => {
        const newMessage = data.value.data.onCreateMessage;
        if (newMessage.chatRoomID !== route.params.id) {
          return;
        }
        fetchMessages();
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ImageBackground source={BG} style={{ width: "100%", height: "100%" }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatMessage myId={myId} message={item} />}
        inverted
      />

      <InputBox chatRoomID={route.params.id} />
    </ImageBackground>
  );
};

export default ChatRoomScreen;
