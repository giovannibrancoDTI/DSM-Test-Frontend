import CustomBreadcrumb from "@/components/customBreadcrumb";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import UserList from "@/components/userList";
import { User } from "@/domain/types";
import userService from "@/services/userService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message as string);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickMyAlbum = () => {
    navigate(`${import.meta.env.VITE_USER_ID}/albums`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <CustomBreadcrumb crumbs={[{ label: "Home", href: "/" }]} />

        <h1 className="text-3xl font-bold mb-4 mt-4">Users List</h1>
        <Button onClick={handleClickMyAlbum} variant="default" className="mb-4">
          My album
        </Button>

        {loading && <p>Loading...</p>}
        {error && <Alert message={error} variant="error" className="mb-4" />}

        <UserList users={users} />
      </div>
    </div>
  );
};

export default UsersPage;
