import { Table, Button, Form, Badge } from "react-bootstrap";
import PaginationComponent from "../../components/table/PaginationComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../apis/user/user.api";
import moment from "moment";

const formatName = (
  first_name: string | null,
  last_name: string | null
): string => {
  return (first_name || "") + " " + (last_name || "");
};

const formatRole = (role: number): JSX.Element => {
  if (role == 1) {
    return <Badge bg="warning">Quản trị viên</Badge>;
  } else {
    return <Badge>Khách hàng</Badge>;
  }
};

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: number;
  created_at: string;
  updated_at: string;
}

function UserList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [searchInputValue, setSearchInputValue] = useState<string>("");

  const [keyword, setKeyword] = useState<string | undefined>("");
  const [page, setPage] = useState<number>(1);

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const fetchUsers = () => {
    userApi
      .searchUsers({
        keyword: keyword,
        page: page,
        limit: 5,
      })
      .then((data: any) => {
        setUsers(data[0]);
        setTotal(data[1]);
      })
      .catch((error: { response: { status: number; statusText: string } }) => {
        if (error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(error.response.statusText);
        }
      });

    setSelectedUserIds([]);
  };

  useEffect(() => {
    fetchUsers();
  }, [keyword, page]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setKeyword(searchInputValue);
  };

  const handleAdd = () => {
    navigate("/users/new");
  };

  const handleEdit = (id: number) => {
    navigate(`/users/${id}/edit`);
  };

  const handleBulkDelete = () => {
    const usernames = users
      .filter((user) => selectedUserIds.includes(user.id))
      .map((user) => user.username);

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa người dùng [${usernames}] không ?`
      )
    ) {
      // TODO: Perform the bulk delete here
      fetchUsers();
    }
  };

  const handleDelete = (id: number, username: string, role: number) => {
    if (role == 1) {
      alert("Quản trị viên không thể bị xóa.");
      return;
    }

    if (
      window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${username} không ?`)
    ) {
      userApi
        .deleteUser(id)
        .then(() => {
          fetchUsers();
        })
        .catch(
          (error: { response: { status: number; statusText: string } }) => {
            if (error.response.status === 401) {
              alert(error.response.statusText);
              navigate("/login");
            } else {
              alert(error.response.statusText);
            }
          }
        );
    }
  };

  const changeUserIdCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUserIds([
        ...selectedUserIds,
        parseInt(event.target.value, 10),
      ]);
    } else {
      const newSelectedUserIds = selectedUserIds.filter(
        (selectedUserId) => selectedUserId !== parseInt(event.target.value, 10)
      );
      setSelectedUserIds(newSelectedUserIds);
    }
  };

  const selectAllUserIdCheckboxes = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const userId = users.map((user) => user.id);
      setSelectedUserIds(userId);
    } else {
      setSelectedUserIds([]);
    }
  };

  const isSelectedAllUserId =
    selectedUserIds.length !== 0 && selectedUserIds.length === users.length;

  return (
    <>
      <h1>Danh sách người dùng</h1>
      <Form className="row m-1 mb-3" onSubmit={handleSearch}>
        <div className="col-8">
          <Form.Control
            type="text"
            value={searchInputValue}
            onChange={(event) => setSearchInputValue(event.target.value)}
            placeholder="Nhập từ khóa"
          />
        </div>
        <div className="col-4">
          <Button type="submit" variant="info mx-1">
            Tìm kiếm
          </Button>
          <Button type="button" variant="primary mx-1" onClick={handleAdd}>
            Thêm mới
          </Button>
          {selectedUserIds.length !== 0 && (
            <Button
              type="button"
              variant="danger mx-1"
              onClick={handleBulkDelete}
            >
              Xóa
            </Button>
          )}
        </div>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                onChange={selectAllUserIdCheckboxes}
                checked={isSelectedAllUserId}
              />
            </th>
            <th>Tên đăng nhập</th>
            <th>Địa chỉ E-mail</th>
            <th>Tên người dùng</th>
            <th>Vai trò</th>
            <th>Thời gian tạo</th>
            <th>Thời gian cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.length > 0 &&
            users.map((user, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      name="id"
                      id={"id-" + user.id}
                      value={user.id}
                      onChange={changeUserIdCheckbox}
                      checked={!!selectedUserIds.find((id) => id === user.id)}
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{formatName(user.first_name, user.last_name)}</td>
                  <td>{formatRole(user.role)}</td>
                  <td>{moment(user.created_at).format("YYYY-MM-DD HH:mm")}</td>
                  <td>{moment(user.updated_at).format("YYYY-MM-DD HH:mm")}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="m-1"
                      onClick={() => handleEdit(user.id)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      className="m-1"
                      onClick={() =>
                        handleDelete(user.id, user.username, user.role)
                      }
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <PaginationComponent total={total} setPage={setPage} />
    </>
  );
}
export default UserList;
