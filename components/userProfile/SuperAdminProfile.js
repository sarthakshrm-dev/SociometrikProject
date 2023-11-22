import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import Loader from '../Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExistingUserByCompany from './ExistingUserByCompany';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

function SuperAdminProfile({ user, close }) {
  const [isLoading, setIsLoading] = useState(false);
  const [minDate, setMinDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [memberTab, setMemberTab] = useState('addNewMember');
  const [allCompanies, setAllCompanies] = useState('');

  useEffect(() => {
    getAllCompanies();
  }, []);

  const getAllCompanies = async () => {
    let allcom = await (
      await fetch(publicRuntimeConfig.API_ROOT_URL + 'companies')
    ).json();
    setAllCompanies(allcom);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailId: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    let raw = {
      email: data.emailId,
      company_name: data.companyName,
      subscription_start: fromDate,
      subscription_end: toDate,
      macro_trends: {
        socioeconomics: data.MT_Socioeconomics,
        demography: data.MT_Demography,
        poi: false,
        customer_segment: false,
        infrastructure: data.MT_Infrastructure,
        digital_penetration: data.MT_DigitaPenetration,
        footfall: false,
      },
      market_expansion: {
        socioeconomics: data.ME_Socioeconomics,
        demography: data.ME_Demography,
        poi: data.ME_PointsOfInterest,
        customer_segment: data.ME_CustomerSegment,
        infrastructure: data.ME_Infrastructure,
        digital_penetration: data.ME_DigitaPenetration,
        footfall: false,
      },
      site_selection: {
        socioeconomics: data.SS_Socioeconomics,
        demography: data.SS_Demography,
        poi: data.SS_PointsOfInterest,
        customer_segment: data.SS_CustomerSegment,
        infrastructure: data.SS_Infrastructure,
        digital_penetration: data.SS_DigitaPenetration,
        footfall: data.SS_Footfall,
      },
      customer_segmentation: {
        socioeconomics: data.CS_Socioeconomics,
        demography: data.CS_Demography,
        poi: false,
        customer_segment: data.CS_CustomerSegment,
        infrastructure: false,
        digital_penetration: false,
        footfall: false,
      },
      site_monitoring: {
        socioeconomics: false,
        demography: false,
        poi: data.SM_PointsOfInterest,
        customer_segment: false,
        infrastructure: false,
        digital_penetration: data.SM_DigitaPenetration,
        footfall: data.SM_Footfall,
      },
      demand_sensing: {
        socioeconomics: data.DS_Socioeconomics,
        demography: data.DS_Demography,
        poi: data.DS_PointsOfInterest,
        customer_segment: false,
        infrastructure: data.DS_Infrastructure,
        digital_penetration: false,
        footfall: false,
      },
    };
    const res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'users/add/', {
      method: 'POST',
      body: JSON.stringify(raw),
      headers: {
        'content-type': 'application/json',
      },
      redirect: 'follow',
    });

    setIsLoading(false);
    if (res.ok) {
      toast.success('Request has been sent successfully!');
      setFromDate(new Date());
      setToDate(new Date());
      await reset({
        email: '',
        company_name: '',
        macro_trends: {
          socioeconomics: false,
          demography: false,
          poi: false,
          customer_segment: false,
          infrastructure: false,
          digital_penetration: false,
          footfall: false,
        },
        market_expansion: {
          socioeconomics: false,
          demography: false,
          poi: false,
          customer_segment: false,
          infrastructure: false,
          digital_penetration: false,
          footfall: false,
        },
        site_selection: {
          socioeconomics: false,
          demography: false,
          poi: false,
          customer_segment: false,
          infrastructure: false,
          digital_penetration: false,
          footfall: false,
        },
        customer_segmentation: {
          socioeconomics: false,
          demography: false,
          poi: false,
          customer_segment: false,
          infrastructure: false,
          digital_penetration: false,
          footfall: false,
        },
        site_monitoring: {
          socioeconomics: false,
          demography: false,
          poi: false,
          customer_segment: false,
          infrastructure: false,
          digital_penetration: false,
          footfall: false,
        },
        demand_sensing: {
          socioeconomics: false,
          demography: false,
          poi: false,
          customer_segment: false,
          infrastructure: false,
          digital_penetration: false,
          footfall: false,
        },
      });
    } else {
      const response = await res.json();
      toast.error(response.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <ToastContainer position="top-center" theme="colored" />
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-dark2 ">
        <div className="container max-w-6xl max-h-screen p-5 overflow-auto">
          <div className="flex justify-between mb-5 font-medium text-primary1">
            <button onClick={close} className="flex items-center">
              <span className="mr-2 text-sm icon-back-arrow"></span> Back to
              main view{' '}
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
          <div className="border p-7 border-primary1 rounded-2xl min-h-[652px]">
            <div className="flex mb-9">
              <div className="flex items-center basis-72">
                <div className="relative mr-3 border rounded-full w-11 h-11 border-primary1">
                  <Image
                    layout="fill"
                    src="/images/profilePicture.png"
                    alt="Profile"
                  />
                </div>
                <div>
                  <div className="text-lg font-medium">{user.full_name}</div>
                  <div>Super Admin</div>
                </div>
              </div>
              <div className="flex justify-between grow">
                <div>
                  <div className="mb-1 text-2xl icon-email text-primary1"></div>
                  <div className="font-medium">{user.email}</div>
                </div>
                <div className="w-px mx-5 bg-primary1"></div>
                <div>
                  <div className="mb-1 text-2xl icon-call text-primary1"></div>
                  <div className="font-medium">{user.phone}</div>
                </div>
                <div className="w-px mx-5 bg-primary1"></div>
                <div>
                  <div className="mb-1 text-2xl icon-group text-primary1"></div>
                  <div className="font-medium">{user.department}</div>
                </div>
                <div className="w-px mx-5 bg-primary1"></div>
                <div>
                  <div className="mb-1 text-2xl icon-bag text-primary1"></div>
                  <div className="font-medium">{user.designation}</div>
                </div>
              </div>
            </div>

            <ul className="flex mb-6 text-base font-medium text-primary1">
              <li
                className={
                  memberTab !== 'addNewMember'
                    ? 'opacity-50 cursor-pointer mr-8'
                    : 'mr-8'
                }
                onClick={() => setMemberTab('addNewMember')}
              >
                Add a new member
              </li>
              <li
                className={
                  memberTab !== 'existingMember'
                    ? 'opacity-50 cursor-pointer'
                    : ''
                }
                onClick={() => setMemberTab('existingMember')}
              >
                Existing member
              </li>
            </ul>

            {memberTab === 'addNewMember' && (
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={styles.gridTable8}>
                    <div className="font-medium">Functionality</div>
                    <div className="font-medium">Socioeconomics</div>
                    <div className="font-medium">Demography</div>
                    <div className="font-medium">Points Of Interest</div>
                    <div className="font-medium">Customer Segment</div>
                    <div className="font-medium">Infrastructure</div>
                    <div className="font-medium">Digital Penetration</div>
                    <div className="font-medium">Footfall</div>

                    <div className="h-px col-span-8 bg-white/20"></div>

                    <div className="text-xs !justify-start">Macro Trends</div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('MT_Socioeconomics')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('MT_Demography')}
                      />
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("MT_PointsOfInterest")}
                    /> */}
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("MT_CustomerSegment")}
                    /> */}
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('MT_Infrastructure')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('MT_DigitaPenetration')}
                      />
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("MT_Footfall")}
                    /> */}
                    </div>

                    <div className="h-px col-span-8 bg-white/20"></div>

                    <div className="text-xs !justify-start">
                      Market Expansion
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('ME_Socioeconomics')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('ME_Demography')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('ME_PointsOfInterest')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('ME_CustomerSegment')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('ME_Infrastructure')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('ME_DigitaPenetration')}
                      />
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("MT_Footfall")}
                    /> */}
                    </div>

                    <div className="h-px col-span-8 bg-white/20"></div>

                    <div className="text-xs !justify-start">Site Selection</div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('SS_Socioeconomics')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('SS_Demography')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('SS_PointsOfInterest')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('SS_CustomerSegment')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('SS_Infrastructure')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('SS_DigitaPenetration')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('SS_Footfall')}
                      />
                    </div>

                    <div className="h-px col-span-8 bg-white/20"></div>

                    <div className="text-xs !justify-start text-left">
                      Customer Segmentation
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('CS_Socioeconomics')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('CS_Demography')}
                      />
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("CS_PointsOfInterest")}
                    /> */}
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('CS_CustomerSegment')}
                      />
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("CS_Infrastructure")}
                    /> */}
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("CS_DigitaPenetration")}
                    /> */}
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("CS_Footfall")}
                    /> */}
                    </div>

                    <div className="h-px col-span-8 bg-white/20"></div>

                    <div className="text-xs !justify-start">
                      Site Monitoring
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("SM_Socioeconomics")}
                    /> */}
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("SM_Demography")}
                    /> */}
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('SM_PointsOfInterest')}
                      />
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("SM_CustomerSegment")}
                    /> */}
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("SM_Infrastructure")}
                    /> */}
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("SM_DigitaPenetration")}
                    /> */}
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('SM_Footfall')}
                      />
                    </div>

                    <div className="h-px col-span-8 bg-white/20"></div>

                    <div className="text-xs !justify-start">Demand Sensing</div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('DS_Socioeconomics')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('DS_Demography')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('DS_PointsOfInterest')}
                      />
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("SM_CustomerSegment")}
                    /> */}
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('DS_Infrastructure')}
                      />
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        className="checkBox"
                        {...register('SM_DigitaPenetration')}
                      />
                    </div>
                    <div>
                      {/* <input
                      type="checkbox"
                      className="checkBox"
                      {...register("SM_Footfall")}
                    /> */}
                    </div>
                  </div>

                  <h2 className="mb-6 text-base font-medium">
                    Provide details of the user
                  </h2>
                  <div className="grid grid-cols-5 gap-3">
                    <div>
                      <label className="mb-1 text-xs">Email</label>
                      <input
                        type="text"
                        placeholder="Email ID"
                        className="form-control"
                        {...register('emailId', {
                          required: true,
                          pattern:
                            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/i,
                        })}
                      />
                      {errors?.emailId?.type === 'required' && (
                        <p className="error">This field is required</p>
                      )}
                      {errors?.emailId?.type === 'pattern' && (
                        <p className="error">
                          You have entered an invalid email address!
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 text-xs">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Company Name"
                        {...register('companyName', {
                          required: true,
                        })}
                      />
                      {errors?.emailId?.type === 'required' && (
                        <p className="error">This field is required</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 text-xs">From</label>
                      <DatePicker
                        selected={fromDate}
                        selectsStart
                        minDate={minDate}
                        onChange={(date) => setFromDate(date)}
                        className="form-control"
                        startDate={fromDate}
                        endDate={toDate}
                      />
                    </div>
                    <div>
                      <label className="mb-1 text-xs">To</label>
                      <DatePicker
                        selected={toDate}
                        selectsEnd
                        minDate={fromDate}
                        onChange={(date) => setToDate(date)}
                        className="form-control"
                        startDate={fromDate}
                        endDate={toDate}
                      />
                    </div>
                    <div className="pt-[18px]">
                      <button className="btn-secondary">Send an invite</button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {memberTab === 'existingMember' && (
              <div className="max-h-[462px] overflow-y-auto">
                {allCompanies.map((company, index) => (
                  <ExistingUserByCompany
                    key={index}
                    companyName={company.name}
                    id={company.id}
                    userCount={company.total_users}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminProfile;
