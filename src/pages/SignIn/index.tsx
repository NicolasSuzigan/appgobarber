import React, {useCallback, useRef} from 'react';
import { Image, KeyboardAvoidingView, ScrollView, Platform, View, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import logoImg from '../../assets/logo.png';
import { useNavigation } from '@react-navigation/native';

import { Form} from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import Button from '../../components/Button';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationError';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccontButton, CreateAccontButtonText } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleSignIn= useCallback(async (data: SignInFormData) => {
    try{
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatorio').email('Digite um e-mail valido'),
        password: Yup.string().required('Senha Obrigatoria'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

 //     await signIn({
 //       email: data.email,
 //       password: data.password,
 //     });

     // history.push('dashboard');
    }catch (err) {
      if(err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert('erro na autenticação',
      'Ocorreu um erro ao fazer o login, cheque as credenciais',
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle = {{flex: 1}} >
        <Container >
          <Image source={logoImg} />

          <View>
            <Title> Faça seu cadastro</Title>
          </View>

          <Form ref={formRef} onSubmit={handleSignIn}>
            <Input
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            name="email"
            icon="mail"
            placeholder="E-mail"
            returnKeyType="next"
            onSubmitEditing={() => {

            }}
            />

            <Input
            ref={passwordInputRef}
            name="password"
            icon="lock"
            placeholder="Senha"
            secureTextEntry
            returnKeyType="send"
            onSubmitEditing={() => {
              formRef.current?.submitForm();
            }}
            />

            <Button onPress={() => {
              formRef.current?.submitForm();
            }}>
              Entrar
            </Button>
          </Form>

          <ForgotPassword onPress={ ()=>{} }>
              <ForgotPasswordText>Esqueci a minha senha</ForgotPasswordText>
          </ForgotPassword>

        </Container>
      </ScrollView>
      </KeyboardAvoidingView>

        <CreateAccontButton onPress={ ()=> navigation.navigate('SignUp') }>
          <Icon name="log-in" size={20} color="#ff9000"/>
          <CreateAccontButtonText>Criar uma conta</CreateAccontButtonText>
        </CreateAccontButton>
    </>
  );
};

export default SignIn;
