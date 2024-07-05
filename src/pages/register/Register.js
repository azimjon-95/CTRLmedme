import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  TimePicker,
  Row,
  Col,
  Tag,
  DatePicker,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { useCreateClinicsMutation } from "../../context/doctorApi";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { PhoneInput } from "react-international-phone";
import { useNavigate } from "react-router-dom";
import "./PhoneInput.css";

const { Option } = Select;

const Register = () => {
  let navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [createClinic, { isLoading }] = useCreateClinicsMutation();
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState("");

  const onSubmit = async (data) => {
    data.userType = "owner";
    data.workStartTime = moment(data.workStartTime).format("HH:mm");
    data.workEndTime = moment(data.workEndTime).format("HH:mm");
    data.paymentDate = moment(data.paymentDate).format("DD.MM.YYYY");
    data.contacts = contacts;
    let res = await createClinic(data);
    console.log(res);
    if (res?.data?.success) {
      message.success("Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi");
      // navigate('/clinics');
    } else {
      message.error("Ro‘yxatdan o‘tishda xatolik yuz berdi", res?.error);
    }
  };

  //
  // const onSubmit = async (data) => {
  //     try {
  //         // Prepare data
  //         const requestData = {
  //             domain: domainName, // Domen nomi
  //             // Qo'shimcha ma'lumotlar, masalan, foydalanuvchi ma'lumotlari
  //             user: {
  //                 name: data.manager,
  //                 email: data.email,
  //                 // Qo'shimcha ma'lumotlar
  //             }
  //         };

  //         // Domen tekshirish uchun API ga so'rov yuborish
  //         const checkDomainResponse = await axios.post('https://api.ahost.uz/check-domain', requestData, {
  //             headers: {
  //                 'Content-Type': 'application/json',
  //                 'Authorization': 'Bearer YOUR_API_TOKEN'
  //             }
  //         });

  //         if (!checkDomainResponse.data.available) {
  //             throw new Error('Domenni tekshirishda xatolik yuz berdi');
  //         }

  //         // Domen mavjud bo'lsa
  //         if (checkDomainResponse.data.available) {
  //             // Domen ro'yxatdan o'tkazish uchun so'rov yuborish
  //             const registerDomainResponse = await axios.post('https://api.ahost.uz/register-domain', requestData, {
  //                 headers: {
  //                     'Content-Type': 'application/json',
  //                     'Authorization': 'Bearer YOUR_API_TOKEN'
  //                 }
  //             });

  //             console.log('Domen ro\'yxatdan o\'tkazildi:', registerDomainResponse.data);
  //         } else {
  //             console.log('Domen band');
  //             // Foydalanuvchiga xabar berish
  //         }

  //         // Ilovada yozish uchun
  //         data.userType = "owner";
  //         data.workStartTime = moment(data.workStartTime).format('HH:mm');
  //         data.workEndTime = moment(data.workEndTime).format('HH:mm');
  //         data.paymentDate = moment(data.paymentDate).format('DD.MM.YYYY');
  //         data.contacts = contacts;
  //         data.domainName = domainName;
  //         let res = await createClinic(data);
  //         console.log(res);
  //         message.success('Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi');
  //         // Saytga o‘tish
  //         window.location.href = '/clinics';

  //     } catch (error) {
  //         message.error('Ro‘yxatdan o‘tishda xatolik yuz berdi: ' + error.message);
  //     }
  // };

  const handleInputChange = (value) => {
    setCurrentContact(value); // Update state with the value directly
  };

  const addContact = () => {
    if (currentContact.trim() !== "") {
      setContacts([...contacts, currentContact]);
      setCurrentContact("");
    }
  };

  const removeContact = (indexToRemove) => {
    setContacts(contacts.filter((_, index) => index !== indexToRemove));
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Klinika nomi"
              validateStatus={errors.name ? "error" : ""}
              help={errors.name ? errors.name.message : ""}
            >
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Klinika nomi talab qilinadi" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Klinika nomini kiriting" />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Manzili"
              validateStatus={errors.address ? "error" : ""}
              help={errors.address ? errors.address.message : ""}
            >
              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{ required: "Manzil talab qilinadi" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Manzilni kiriting" />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Aloqa uchun tel"
              validateStatus={errors.currentContact ? "error" : ""}
              help={errors.currentContact ? errors.currentContact.message : ""}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <PhoneInput
                  defaultCountry="uz"
                  value={currentContact}
                  className="PhoneInput_el"
                  onChange={(value) => handleInputChange(value)}
                  placeholder="Aloqa uchun telefon raqamini kiriting"
                  inputStyle={{
                    width: "100%",
                    height: "31px",
                    border: ".5px solid #d8d8d8",
                    borderRadius: "5px",
                    textIndent: "10px",
                    outline: "none",
                  }} // Komponentni moslashtirish uchun stili o'zgartiring
                />
                <Button
                  type="dashed"
                  onClick={addContact}
                  icon={<PlusOutlined />}
                />
              </div>
            </Form.Item>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {contacts.map((contact, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => removeContact(index)}
                  style={{ marginTop: "8px" }}
                >
                  {contact}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Direktor yoki rahbar ma’lumotlari: (FIO)"
              validateStatus={errors.manager ? "error" : ""}
              help={errors.manager ? errors.manager.message : ""}
            >
              <Controller
                name="manager"
                control={control}
                defaultValue=""
                rules={{
                  required: "Direktor yoki rahbar ma’lumotlari talab qilinadi",
                }}
                render={({ field }) => (
                  <Input {...field} placeholder="Direktor yoki rahbar FIO" />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ish vaqti">
              <Input.Group compact>
                <Controller
                  name="workStartTime"
                  control={control}
                  defaultValue={moment("08:00", "HH:mm")}
                  rules={{
                    required: "Boshlanish va Tugash vaqti talab qilinadi",
                  }}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      format="HH:mm"
                      style={{ width: "50%" }}
                      placeholder="Boshlanish vaqti"
                      defaultValue={moment("08:00", "HH:mm")}
                    />
                  )}
                />
                <Controller
                  name="workEndTime"
                  control={control}
                  defaultValue={moment("16:00", "HH:mm")}
                  rules={{
                    required: "Boshlanish va Tugash vaqti talab qilinadi",
                  }}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      format="HH:mm"
                      style={{ width: "50%" }}
                      placeholder="Tugash vaqti"
                      defaultValue={moment("16:00", "HH:mm")}
                    />
                  )}
                />
              </Input.Group>
              {errors.workStartTime && (
                <p style={{ color: "red" }}>{errors.workStartTime.message}</p>
              )}
              {errors.workEndTime && (
                <p style={{ color: "red" }}>{errors.workEndTime.message}</p>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Login"
              validateStatus={errors.login ? "error" : ""}
              help={errors.login ? errors.login.message : ""}
            >
              <Controller
                name="login"
                control={control}
                defaultValue=""
                rules={{ required: "Login kiritilishi shart" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Login kiriting" />
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Parol"
              validateStatus={errors.password ? "error" : ""}
              help={errors.password ? errors.password.message : ""}
            >
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: "Parol kiritilishi shart" }}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="Parol kiriting" />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Klinika narxini tanlang"
              validateStatus={errors.clinicPrice ? "error" : ""}
              help={errors.clinicPrice ? errors.clinicPrice.message : ""}
            >
              <Controller
                name="clinicPrice"
                control={control}
                defaultValue=""
                rules={{ required: "Klinika narxini tanlang" }}
                render={({ field }) => (
                  <Select {...field} placeholder="Klinika narxini tanlang">
                    <Option value={1000000}>{`Klinika A - ${formatNumber(
                      1000000
                    )} so'm`}</Option>
                    <Option value={700000}>{`Klinika B - ${formatNumber(
                      700000
                    )} so'm`}</Option>
                    <Option value={500000}>{`Klinika C - ${formatNumber(
                      500000
                    )} so'm`}</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="To`lov qilish sanasi"
              validateStatus={errors.paymentDate ? "error" : ""}
              help={errors.paymentDate ? errors.paymentDate.message : ""}
            >
              <Controller
                name="paymentDate"
                control={control}
                defaultValue={null}
                rules={{ required: "To`lov qilish sanasini tanlang" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    format="DD.MM.YYYY"
                    style={{ width: "100%" }}
                    placeholder="To`lov qilish sanasini tanlang"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={isLoading}
          >
            Ro‘yxatdan o‘tish
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
