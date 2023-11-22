import Image from 'next/image';
import { signOut } from 'next-auth/react';
import 'react-datepicker/dist/react-datepicker.css';

function NormalUserProfile({ user, close }) {
  return (
    <div className='fixed inset-0 bg-dark2 z-30 flex justify-center items-center '>
      <div className='max-w-3xl p-5 container overflow-auto max-h-screen'>
        <div className='flex justify-between font-medium text-primary1 mb-5'>
          <button onClick={close} className='flex items-center'>
            <span className='icon-back-arrow mr-2 text-sm'></span> Back to main
            view{' '}
          </button>
          <button
            onClick={() =>
              signOut({
                callbackUrl: '/login',
              })
            }
          >
            Logout
          </button>
        </div>
        <div className='p-7 border border-primary1 rounded-2xl'>
          <div className='flex items-center w-full mb-7'>
            <div className='w-11 h-11 relative border border-primary1 rounded-full mr-3'>
              <Image
                layout='fill'
                src='/images/profilePicture.png'
                alt='Profile'
              />
            </div>
            <div>
              <div className='text-lg font-medium'>{user.full_name}</div>
              <div>User</div>
            </div>
          </div>
          <ul className='grid grid-cols-3 gap-9'>
            <li>
              <div className='icon-email text-2xl text-primary1 mb-1'></div>
              <div className='font-medium'>{user.email}</div>
            </li>
            <li>
              <div className='icon-call text-2xl text-primary1 mb-1'></div>
              <div className='font-medium'>{user.phone}</div>
            </li>
            <li>
              <div className='icon-group text-2xl text-primary1 mb-1'></div>
              <div className='font-medium'>{user.department}</div>
            </li>
            <li>
              <div className='icon-bag text-2xl text-primary1 mb-1'></div>
              <div className='font-medium'>{user.designation}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NormalUserProfile;
