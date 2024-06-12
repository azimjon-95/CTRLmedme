import React from 'react';
import { useCreateUserMutation, useGetUserQuery, useDeleteUserMutation } from '../context/userApi';
import { Form, Input, Button, message, Table, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const CreateUser = () => {
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const { data: users, isLoading: isUsersLoading } = useGetUserQuery();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();


    const onFinish = async (values) => {
        try {
            await createUser(values).unwrap();
            message.success('Foydalanuvchi muvaffaqiyatli yaratildi');
        } catch (error) {
            message.error(`Foydalanuvchi yaratishda xato: ${error.data?.message || error.message}`);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId).unwrap();
            message.success('Foydalanuvchi muvaffaqiyatli o\'chirildi');
        } catch (error) {
            message.error(`Foydalanuvchini o'chirishda xato: ${error.data?.message || error.message}`);
        }
    };

    const columns = [
        {
            title: 'Foydalanuvchi',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Telefon raqami',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Login',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Parol',
            dataIndex: 'password',
            key: 'password',
            render: (_, record) => (
                <Tooltip title={record.password}>
                    <span style={{ cursor: 'pointer', fontWeight: "700" }}>
                        {'********'}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: "O'chirish",
            dataIndex: '',
            key: 'delete',
            render: (_, record) => (
                <Button type="danger" onClick={() => handleDeleteUser(record._id)} loading={isDeleting}>
                    <DeleteOutlined />
                </Button>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-around', padding: '10px' }}>
            <div style={{ width: '40%' }}>
                <h2>Foydalanuvchi yaratish</h2>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Foydalanuvchi nomi"
                        name="username"
                        rules={[{ required: true, message: 'Foydalanuvchi nomi kiritilishi shart' }]}
                    >
                        <Input placeholder="Foydalanuvchi nomini kiriting" />
                    </Form.Item>
                    <Form.Item
                        label="Parol"
                        name="password"
                        rules={[{ required: true, message: 'Parol kiritilishi shart' }]}
                    >
                        <Input.Password placeholder="Parolni kiriting" />
                    </Form.Item>
                    <Form.Item
                        label="Telefon raqami"
                        name="phone"
                        rules={[{ required: true, message: 'Telefon raqami kiritilishi shart' }]}
                    >
                        <Input placeholder="Telefon raqamini kiriting" />
                    </Form.Item>
                    <Form.Item
                        label="Ism"
                        name="name"
                        rules={[{ required: true, message: 'Ism kiritilishi shart' }]}
                    >
                        <Input placeholder="Ismingizni kiriting" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isCreating}>
                            Foydalanuvchi yaratish
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div style={{ width: '60%' }}>
                <h2>Foydalanuvchilar ro'yxati</h2>
                <Table
                    columns={columns}
                    dataSource={Array.isArray(users) ? users : []}
                    loading={isUsersLoading}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                />
            </div>
        </div>
    );
};

export default CreateUser;
