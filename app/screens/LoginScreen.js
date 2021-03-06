import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";

import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import { LinkButton } from "../components";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import { Image, View } from "../components/styles";
import { images } from "../config";
import routes from "../navigation/routes";

let validationSchema = Yup.object().shape({
  email: Yup.string().required().email("Invalid Email").label("Email"),
  password: Yup.string().required().min(5).max(50).label("Password"),
});

const LoginScreen = ({ navigation }) => {
  const auth = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);

  const handleSubmit = async ({ email, password }) => {
    const result = await authApi.login(email, password);
    if (!result.ok) return setLoginFailed(true);
    setLoginFailed(false);
    auth.logIn(result.data);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={100}
      enableOnAndroid
      enableAutomaticScroll
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
    >
      <View container>
        <Image logo source={images[2]} />
        <Form
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <ErrorMessage
            error="Invalid email and/or password"
            visible={loginFailed}
          />
          <FormField
            allowFontScaling={false}
            autoCapitalize="none"
            autoCompleteType="email"
            autoCorrect={false}
            blurOnSubmit={false}
            icon="email"
            keyboardAppearance="default"
            keyboardType="email-address"
            name="email"
            numberOfLines={1}
            placeholder="Email address"
            returnKeyLabel="next"
            returnKeyType="next"
            textContentType="emailAddress"
          />
          <FormField
            allowFontScaling={false}
            autoCapitalize="none"
            autoCompleteType="password"
            autoCorrect={false}
            blurOnSubmit={false}
            icon="lock"
            keyboardAppearance="default"
            keyboardType="default"
            maxLength={50}
            name="password"
            numberOfLines={1}
            placeholder="Password"
            returnKeyLabel="go"
            returnKeyType="go"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="Login" />
        </Form>
        <LinkButton
          title="Don't have an account?"
          label="Register Here"
          onPress={() => navigation.navigate(routes.REGISTER)}
        />
        <StatusBar style="dark" />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
