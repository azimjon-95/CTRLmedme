import React, { useState } from 'react';
import { Form, Input, Button, Select, message, TimePicker, Row, Col, Tag, DatePicker } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useCreateClinicsMutation } from '../../context/doctorApi';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const Register = () => {
    const { handleSubmit, control, formState: { errors } } = useForm();
    const [createClinic, { isLoading }] = useCreateClinicsMutation();
    const [contacts, setContacts] = useState([]);
    const [currentContact, setCurrentContact] = useState('');

    const onSubmit = async (data) => {
        try {
            data.userType = "owner";
            data.workStartTime = moment(data.workStartTime).format('HH:mm');
            data.workEndTime = moment(data.workEndTime).format('HH:mm');
            data.paymentDate = data.paymentDate ? moment(data.paymentDate, 'DD.MM.YYYY').toDate() : null;
            data.contacts = contacts;
            console.log(data); // Console log the data here
            let res = await createClinic(data)
            console.log(res);
            message.success('Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi');
        } catch (error) {
            message.error('Ro‘yxatdan o‘tishda xatolik yuz berdi: ' + error.message);
        }
    };

    const handleInputChange = (e) => {
        setCurrentContact(e.target.value);
    };

    const addContact = () => {
        if (currentContact.trim() !== '') {
            setContacts([...contacts, currentContact]);
            setCurrentContact('');
        }
    };

    const removeContact = (indexToRemove) => {
        setContacts(contacts.filter((_, index) => index !== indexToRemove));
    };

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
        <div style={{ width: "100%", padding: "20px" }}>
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Klinika nomi" validateStatus={errors.name ? 'error' : ''} help={errors.name ? errors.name.message : ''}>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Klinika nomi talab qilinadi' }}
                                render={({ field }) => <Input {...field} placeholder="Klinika nomini kiriting" />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Manzili" validateStatus={errors.address ? 'error' : ''} help={errors.address ? errors.address.message : ''}>
                            <Controller
                                name="address"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Manzil talab qilinadi' }}
                                render={({ field }) => <Input {...field} placeholder="Manzilni kiriting" />}
                            />
                        </Form.Item>
                    </Col>
                    {/* <Col span={8}>
                        <Form.Item label="Aloqa uchun tel" validateStatus={errors.currentContact ? 'error' : ''} help={errors.currentContact ? errors.currentContact.message : ''}>
                            <div style={{ display: "flex" }}>
                                <Controller
                                    name="currentContact"
                                    control={control}

                                    rules={{
                                        required: 'Aloqa uchun tel talab qilinadi',
                                        pattern: {
                                            value: /^[0-9]{9,13}$/,
                                            message: 'Aloqa raqami 9-13 raqamdan iborat bo‘lishi kerak',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={currentContact}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                field.onChange(e);
                                            }}
                                            placeholder="Aloqa uchun telefon raqamini kiriting"
                                        />
                                    )}
                                />
                                <Button type="dashed" onClick={addContact} icon={<PlusOutlined />} />
                            </div>
                        </Form.Item>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {contacts.map((contact, index) => (
                                <Tag key={index} closable onClose={() => removeContact(index)} style={{ marginTop: '8px' }}>
                                    {contact}
                                </Tag>
                            ))}
                        </div>
                    </Col> */}

                    <Col span={8}>
                        <Form.Item
                            label="Aloqa uchun tel"
                            validateStatus={errors.currentContact ? 'error' : ''}
                            help={errors.currentContact ? errors.currentContact.message : ''}
                        >
                            <div style={{ display: "flex" }}>
                                <Controller
                                    name="currentContact"
                                    control={control}
                                    rules={{
                                        required: 'Aloqa uchun tel talab qilinadi',
                                        pattern: {
                                            value: /^[0-9]{9,13}$/,
                                            message: 'Aloqa raqami 9-13 raqamdan iborat bo‘lishi kerak',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={currentContact}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                field.onChange(e);
                                            }}
                                            placeholder="Aloqa uchun telefon raqamini kiriting"
                                        />
                                    )}
                                />
                                <Button type="dashed" onClick={addContact} icon={<PlusOutlined />} />
                            </div>
                        </Form.Item>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {contacts.map((contact, index) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => removeContact(index)}
                                    style={{ marginTop: '8px' }}
                                >
                                    {contact}
                                </Tag>
                            ))}
                        </div>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Direktor yoki rahbar ma’lumotlari: (FIO)" validateStatus={errors.manager ? 'error' : ''} help={errors.manager ? errors.manager.message : ''}>
                            <Controller
                                name="manager"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Direktor yoki rahbar ma’lumotlari talab qilinadi' }}
                                render={({ field }) => <Input {...field} placeholder="Direktor yoki rahbar FIO" />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Ish vaqti">
                            <Input.Group compact>
                                <Controller
                                    name="workStartTime"
                                    control={control}
                                    defaultValue={moment('08:00', 'HH:mm')}
                                    rules={{ required: 'Boshlanish va Tugash vaqti talab qilinadi' }}
                                    render={({ field }) => (
                                        <TimePicker
                                            {...field}
                                            format="HH:mm"
                                            style={{ width: '50%' }}
                                            placeholder="Boshlanish vaqti"
                                            defaultValue={moment('08:00', 'HH:mm')}
                                        />
                                    )}
                                />
                                <Controller
                                    name="workEndTime"
                                    control={control}
                                    defaultValue={moment('16:00', 'HH:mm')}
                                    rules={{ required: 'Boshlanish va Tugash vaqti talab qilinadi' }}
                                    render={({ field }) => (
                                        <TimePicker
                                            {...field}
                                            format="HH:mm"
                                            style={{ width: '50%' }}
                                            placeholder="Tugash vaqti"
                                            defaultValue={moment('16:00', 'HH:mm')}
                                        />
                                    )}
                                />
                            </Input.Group>
                            {errors.workStartTime && <p style={{ color: 'red' }}>{errors.workStartTime.message}</p>}
                            {errors.workEndTime && <p style={{ color: 'red' }}>{errors.workEndTime.message}</p>}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Login" validateStatus={errors.login ? 'error' : ''} help={errors.login ? errors.login.message : ''}>
                            <Controller
                                name="login"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Login kiritilishi shart' }}
                                render={({ field }) => <Input {...field} placeholder="Login kiriting" />}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Parol" validateStatus={errors.password ? 'error' : ''} help={errors.password ? errors.password.message : ''}>
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Parol kiritilishi shart' }}
                                render={({ field }) => <Input.Password {...field} placeholder="Parol kiriting" />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Klinika narxini tanlang" validateStatus={errors.clinicPrice ? 'error' : ''} help={errors.clinicPrice ? errors.clinicPrice.message : ''}>
                            <Controller
                                name="clinicPrice"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Klinika narxini tanlang' }}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Klinika narxini tanlang">
                                        <Option value={1000000}>{`Klinika A - ${formatNumber(1000000)} so'm`}</Option>
                                        <Option value={700000}>{`Klinika B - ${formatNumber(700000)} so'm`}</Option>
                                        <Option value={500000}>{`Klinika C - ${formatNumber(500000)} so'm`}</Option>
                                    </Select>
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Tulov qilish cheslosiga" validateStatus={errors.paymentDate ? 'error' : ''} help={errors.paymentDate ? errors.paymentDate.message : ''}>
                            <Controller
                                name="paymentDate"
                                control={control}
                                defaultValue={null}
                                rules={{ required: 'Tulov qilish cheslosiga tanlang' }}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        format="DD.MM.YYYY"
                                        style={{ width: "100%" }}
                                        placeholder="Tulov qilish cheslosiga tanlang"
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={isLoading}>
                        Ro‘yxatdan o‘tish
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register;
