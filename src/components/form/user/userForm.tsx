import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import userApi from "../../../apis/user/user.api";
import ResourceNotFound from "../../errors/ResourceNotFound";

interface UserFormProps {
  userId: string;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: number | string;
  avatar?: Blob | null;
}

function userForm({ userId, onSubmit, onCancel }: UserFormProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: 2,
    avatar: null,
  });
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errors, setErrors] = useState(new Map<string, string>());

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setIsEdit(!!userId);

    if (userId == undefined) {
      setUser({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        role: 2,
        avatar: null,
      });
    } else {
      userApi
        .getUserByUserId(userId)
        .then((response) => {
          console.log("response-------", response);

          setUser({
            ...response,
            first_name: response.first_name || "",
            last_name: response.last_name || "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userId]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case "password":
        setPassword(value);
        break;
      case "confirmation_password":
        setConfirmationPassword(value);
        break;
      case "avatar":
        const selectedFile = event.target.files?.[0]; // Lấy file đầu tiên trong trường input

        setUser({
          ...user,
          [name]: selectedFile || null,
        });
        break;
      default:
        setUser({
          ...user,
          [name]: name === "role" ? parseInt(value) : value,
        });
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();

    if (validationErrors.size === 0) {
      const formData = new FormData();

      if (password !== "") {
        setUser({
          ...user,
          password: password,
        });
        console.log("------------------------>", user);

        formData.append("password", password);
      }
      formData.append("username", user!.username);
      formData.append("email", user!.email);
      formData.append("first_name", user!.first_name);
      formData.append("last_name", user!.last_name);
      formData.append("role", String(user.role));

      if (user.avatar) {
        formData.append("avatar", user.avatar);
      }

      onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const validate = (): Map<string, string> => {
    const validationErrors = new Map<string, string>();

    if (
      user!.username.length < 4 ||
      user!.username.length > 10 ||
      !/^[A-Za-z0-9]+$/.test(user!.username)
    ) {
      validationErrors.set(
        "username",
        "Tên đăng nhập bắt buộc nhập từ 4 đến 10 ký tự."
      );
    }

    if (user!.email.length < 4 || user!.email.length > 100) {
      validationErrors.set(
        "email",
        "Địa chỉ E-mail bắt buộc nhập từ 4 đến 100 ký tự."
      );
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user!.email)
    ) {
      validationErrors.set("email", "Địa chỉ E-mail không đúng định dạng.");
    }

    if (user!.first_name !== null && user!.first_name.length > 100) {
      validationErrors.set(
        "first_name",
        "Họ chỉ được phép nhập nhỏ hơn 100 ký tự."
      );
    }

    if (user!.last_name !== null && user!.last_name.length > 100) {
      validationErrors.set(
        "last_name",
        "Tên chỉ được phép nhập nhỏ hơn 100 ký tự."
      );
    }

    if (!isEdit && password === "") {
      validationErrors.set(
        "password",
        "Mật khẩu bắt buộc nhập từ 8 đến 20 ký tự."
      );
    } else if (
      password !== "" &&
      (password.length < 8 || password.length > 20)
    ) {
      validationErrors.set(
        "password",
        "Mật khẩu bắt buộc nhập từ 8 đến 20 ký tự."
      );
    }

    if (confirmationPassword !== password) {
      validationErrors.set(
        "confirmation_password",
        "Xác nhận mật khẩu không trùng khớp."
      );
    }

    return validationErrors;
  };

  return (
    <>
      {user ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Tên đăng nhập <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              disabled={isEdit}
              isInvalid={!!errors.get("username")}
            />
            <Form.Text className="text-danger">
              {errors.get("username")}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Địa chỉ E-mail <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={isEdit}
              isInvalid={!!errors.get("email")}
            />
            <Form.Text className="text-danger">{errors.get("email")}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Họ</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              isInvalid={!!errors.get("first_name")}
            />
            <Form.Text className="text-danger">
              {errors.get("first_name")}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              isInvalid={!!errors.get("last_name")}
            />
            <Form.Text className="text-danger">
              {errors.get("last_name")}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Mật khẩu {!isEdit && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              isInvalid={!!errors.get("password")}
            />
            <Form.Text className="text-danger">
              {errors.get("password")}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Xác nhận mật khẩu{" "}
              {!isEdit && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              type="password"
              name="confirmation_password"
              value={confirmationPassword}
              onChange={handleChange}
              isInvalid={!!errors.get("confirmation_password")}
            />
            <Form.Text className="text-danger">
              {errors.get("confirmation_password")}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="mr-5">
              Vai trò <span className="text-danger">*</span>
            </Form.Label>
            <div className="px-3">
              <Form.Check
                inline
                type="radio"
                name="role"
                label="Khách hàng"
                id="role-1"
                value="2"
                checked={user.role == 2}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="role"
                label="Quản trị viên"
                id="role-2"
                value="1"
                checked={user.role == 1}
                onChange={handleChange}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hình ảnh đại diện</Form.Label>
            <Form.Control
              type="file"
              name="avatar"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleChange}
              multiple
            />
            <Form.Text className="text-danger">
              {errors.get("avatar")}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3 float-end">
            <Button
              type="button"
              variant="secondary"
              className="m-1"
              onClick={onCancel}
            >
              Hủy
            </Button>
            <Button type="submit" variant="success" className="m-1">
              Lưu
            </Button>
          </Form.Group>
        </Form>
      ) : (
        <ResourceNotFound resourceName="người dùng" />
      )}
    </>
  );
}

export default userForm;
