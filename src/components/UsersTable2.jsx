import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Table, Tag, Button } from "antd";
import { useEffect, useState } from "react";
import { axios } from "../api/api";
import "./UsersTable2.css";
import { Image } from "antd";
import { useHistory } from "react-router-dom";
import { AppContext } from "../App";
import { useContext } from "react";

const UsersTable2 = ({ areas }) => {
  const [data, setData] = useState([]);
  const [isNeedUpdate, setIsNeedUpdate] = useState(true);

  const history = useHistory();

  const goToArea = (name) => {
    history.push("area/" + name);
  };

  const items = [
    {
      key: "1",
      label: "Лаборатория",
      project_name: "laboratory",
    },
    {
      key: "2",
      label: "Электричество",
      project_name: "electricity",
    },
  ];

  useEffect(() => {
    isNeedUpdate &&
      axios.get("http://localhost:3003/get_users").then(({ data }) => {
        setData(data);
        setIsNeedUpdate(false);
      });
  }, [isNeedUpdate]);

  const RowRender = ({ selectedId }) => {
    const data1 = data.filter((user) => user.id === selectedId);
    const data2 = data1[0].access_user.recordset.filter((user) =>
      user.users_id2.split(" ").includes("" + selectedId)
    );

    let tags = [];
    let i = 0;
    for (i = 0; i < data2.length; i++) {
      tags[i] = data2[i].projects;
    }

    data1[0].tags = tags;

    const removeAccess = (...args) => {
      let users_id = selectedId;

      console.log(args[0].key);
      let projects;
      switch (args[0].key) {
        case "1":
          projects = "laboratory";
          break;
        case "2":
          projects = "electricity";
          break;
      }
      console.log(projects);

      axios
        .post("http://localhost:3003/remove_access", {
          users_id,
          projects,
        })
        .then(function (response) {
          setIsNeedUpdate(true);
        });
    };

    const setRigths = (...args) => {
      console.log(selectedId);

      let users_id = selectedId;

      console.log(args[0].key);
      let projects;
      switch (args[0].key) {
        case "1":
          projects = "laboratory";
          break;
        case "2":
          projects = "electricity";
          break;
      }
      console.log(projects);

      axios
        .post("http://localhost:3003/give_access", {
          users_id,
          projects,
        })
        .then(function (response) {
          setIsNeedUpdate(true);
        });
    };

    const columns = [
      {
        title: "Логин в SAP",
        dataIndex: "login_sap",
        key: "login_sap",
      },
      {
        title: "Телефон",
        dataIndex: "phone_number",
        key: "phone_number",
      },
      {
        title: "Активен",
        key: "state",
        render: () => (
          <span>
            <Badge status="success" />
            Активен
          </span>
        ),
      },

      {
        title: "ID telegram",
        dataIndex: "telegram_id",
        key: "telegram_id",
      },
      {
        title: "Электронная почта",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Описание",
        dataIndex: "discription",
        key: "discription",
      },
      {
        title: "Доступ",
        key: "tags",
        dataIndex: "tags",
        render: (_, { tags }) => (
          <>
            {tags.map((tag) => {
              let color = "green";
              return (
                <Tag color={color} key={tag}>
                  {tag}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: "Управление доступом",
        dataIndex: "operation",
        key: "operation",
        render: () => (
          <Space size="middle">
            <Dropdown
              menu={{
                items,
                onClick: setRigths,
              }}
              trigger={["click"]}
            >
              <a>
                Добавить доступ <DownOutlined />
              </a>
            </Dropdown>
            <Dropdown
              menu={{
                items,
                onClick: removeAccess,
              }}
            >
              <a>
                Забрать доступ <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={data.filter((user) => user.id === selectedId)}
        pagination={false}
      />
    );
  };

  const columns = [
    {
      title: "",
      render: (user) => <Image src={`${user.id}.jpg`} width={80} />,
      width: "3%",
    },
    {
      title: "",
      dataIndex: "last_name",
      key: "name",
      width: "4%",
    },
    {
      title: "ФИО",
      dataIndex: "first_name",
      key: "name",
      width: "4%",
    },
    {
      title: "",
      dataIndex: "middle_name",
      key: "name",
      width: "47%",
    },
    {
      title: "Цех",
      dataIndex: "workshop",
      key: "workshop",
      width: "20%",
    },
    {
      title: "Должность",
      dataIndex: "post",
      key: "post",
      width: "20%",
    },
  ];
  const {
    auth: { tryLogout, user },
  } = useContext(AppContext);
  return (
    <>
      <div className="user-container">
        <div></div>
        <div className="user">
          <div>
            Здравствуйте,{" "}
            <span>
              {user.first_name} {user.middle_name}
            </span>
            !
          </div>
          <Button danger onClick={tryLogout}>
            Выйти
          </Button>
        </div>
      </div>
      <Table
        rowClassName="rowTable"
        columns={columns}
        expandable={{
          expandRowByClick: true,
          indentSize: -1,
          expandIconColumnIndex: -1,
          expandedRowRender: (user) => <RowRender selectedId={user.id} />,
          defaultExpandedRowKeys: ["0"],
        }}
        dataSource={data}
      />
    </>
  );
};

export default UsersTable2;
