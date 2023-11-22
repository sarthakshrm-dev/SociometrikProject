import { useState, useEffect } from "react";
import ExistingUser from "./ExistingUser";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

function ExistingUserByCompany({ companyName, id, userCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const [allUsers, setAllUsers] = useState()

  useEffect(() => {
    getUsers(id)
}, [])

const getUsers = async(id) => {
    setAllUsers(await (await fetch(publicRuntimeConfig.API_ROOT_URL + 'users/company/' + id)).json())
  }

  return (
    <div>
      <div className="mb-3 border border-white/20 rounded-xl">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between p-3 shadow cursor-pointer bg-gradient-to-r from-primary2/50 rounded-xl"
        >
          <div>
            <span className="text-lg">{companyName}</span>{" "}
          <span className="px-2 ml-3 text-xs border border-white rounded-full opacity-50">{userCount} Users</span>
          </div>
          <span className={`icon-rght-arrow transition-all mr-2 ${isOpen ? '-rotate-90 text-primary1' : 'rotate-90'}`}></span>
        </div>
        {isOpen && (
          <div className="p-2">
            <ExistingUser users={allUsers} fetchUsers={() => getUsers(id)} superAdmin />
          </div>
        )}
      </div>
    </div>
  );
}

export default ExistingUserByCompany;
