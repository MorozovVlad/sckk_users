import "./Login.scss";
import { Button, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { AppContext } from "../../App";

const Login = () => {
  const {
    auth: { tryLogin },
  } = useContext(AppContext);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-component">
      <h1>Авторизация</h1>
      <Form
        onFinish={tryLogin}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="login-form"
      >
        <Form.Item
          name="login"
          rules={[
            {
              required: true,
              message: "Введите логин!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Логин"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Введите пароль!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Пароль"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
