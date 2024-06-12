import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Modal } from 'antd';
import { UserOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import { BiClinic } from "react-icons/bi";
import Logo from '../img/LogoOneMed.png';

const { Header, Content, Sider } = Layout;

const MainLayout = ({ handleLogout }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const location = useLocation();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        handleLogout();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible>
                <div style={{ height: "63px", display: "flex", alignItems: "center", paddingLeft: "30px" }}>
                    <img width={100} src={Logo} alt="Logo" />
                </div>
                <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} defaultSelectedKeys={['2']}>
                    <Menu.Item key="/clinics" icon={<AppstoreOutlined />}>
                        <Link to="/clinics">Klinikalar jadvali</Link>
                    </Menu.Item>
                    <Menu.Item key="/register" icon={<BiClinic />}>
                        <Link to="/register">Klinikani Ro'yxatga olish</Link>
                    </Menu.Item>
                    <Menu.Item key="/create_admin" icon={<UserOutlined />}>
                        <Link to="/create_admin">Admindi Ro'yxatga olish</Link>
                    </Menu.Item>
                    <Menu.Item icon={<LogoutOutlined />} key="logout" onClick={showModal}>
                        Chiqish
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0, textAlign: 'center', color: 'white' }}>
                    <h1>Klinik boshqaruv tizimi</h1>
                </Header>
                <Content>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
            <Modal
                title="Chiqish"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="OK"
                cancelText="NO"
            >
                <p>Chiqishni istaysizmi?</p>
            </Modal>
        </Layout>
    );
};

export default MainLayout;
