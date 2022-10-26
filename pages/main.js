import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode"
import moment from 'moment'
import axios from 'axios'
import config from '../config'
import Dashboard from '../component/content/dashboard'
import Controluser from '../component/content/controluser'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Modal } from 'antd';
import Deptadd from '../component/content/deptadd'
import Planadd from '../component/content/addplan'
import Approve from '../component/content/approves'

const api = config.api

const Main = () => {

    const router = useRouter()
    const { path, error } = router.query
    const [Token, setToken] = useState('')
    const [profile, setProfile] = useState({})
    const [editPassword, seteditPassword] = useState(false);
    const [oldPassword, setoldPassword] = useState('')
    const [inputPassword, setinputPassword] = useState('')
    const [typeCheck, setTypeCheck] = useState(0)
    const [passwordNew, setpasswordNew] = useState({ cid: '', username: '', newPassword: '', newPasswordConfrim: '' })

    useEffect(() => {

        const token = localStorage.getItem('token')

        if (token == null) {
            back()
        }

        const decodeToken = jwt_decode(token)
        setToken(token)
        setProfile(decodeToken)



    }, [])

    // ---------------------------------------------------------------------------------------------------------------------------- START ALL ROUTER
    const Home = () => {
        router.push({
            pathname: '/main',
            query: {
                path: 'dashboard'
            },
        })
    }

    const ControlUser = () => {
        router.push({
            pathname: '/main',
            query: {
                path: 'controluser'
            },
        })
    }

    const ControlDept = () => {
        router.push({
            pathname: '/main',
            query: {
                path: 'controldept'
            },
        })
    }

    const AddPlan = () => {
        router.push({
            pathname: '/main',
            query: {
                path: 'add-plan'
            },
        })
    }

    const Approves = () => {
        router.push({
            pathname: '/main',
            query: {
                path: 'approves'
            },
        })
    }

    const back = () => {
        router.push({
            pathname: '/'
        })
    }

    const logOut = () => {
        localStorage.removeItem('token')
        router.push({
            pathname: '/'
        })
    }
    // ---------------------------------------------------------------------------------------------------------------------------- END ALL ROUTER

    //--------------------------------------------------------------------------------------------------------------------- START EDIT AND NEW PASSWORD
    const showModal = async (data) => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-user/${data.cid}`, { headers: { "token": token } })
            // console.log(res.data[0])
            // console.log(profile.username)
            setoldPassword(res.data[0].usr_password)
            setpasswordNew({
                ...passwordNew,
                cid: res.data[0].usr_cid,
                username: profile.username
            })

        } catch (error) {
            console.log(error)
        }
        seteditPassword(true);
    };

    const handleOk = async () => {
        if (passwordNew.newPassword.length > 0 && passwordNew.newPasswordConfrim.length > 0) {
            if (passwordNew.newPassword == passwordNew.newPasswordConfrim) {
                try {
                    const token = localStorage.getItem('token')
                    let res = await axios.post(`${api}/edit-password-by-person`, passwordNew, { headers: { "token": token } })
                    logOut()
                    // console.log(res)
                    // res.data.status == 'success' ? toast.success('แก้ไขรหัสผ่านสำเร็จ') : toast.error('แก้ไขรหัสผ่านล้มเหลว')
                } catch (error) {
                    // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
                    console.log(error)
                }
            } else {
                toast.error('รหัสผ่านไม่ตรงกัน กรุณากรอกใหม่')
            }
        }
    };

    const handleCancel = () => {
        seteditPassword(false);
    };

    const onCheck = () => {
        if (inputPassword == oldPassword) {
            setTypeCheck(1)
        } else {
            toast.error('รหัสผ่านไม่ถูกต้อง')
        }
    }
    //--------------------------------------------------------------------------------------------------------------------- END EDIT AND NEW PASSWORD

    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={2500}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={true}
                draggable={true}
                pauseOnHover={true}
                // transition={Flip}
                theme={'colored'}
            />
            {
                Token == null || Token == '' ? '' :
                    <div className='wrapper'>
                        {/* --------------------------------------------------------------------------------------------------------------------------------------------- NAV */}
                        <nav className="main-header navbar navbar-expand navbar-white navbar-light" style={{ zIndex: 5 }}>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" data-widget="pushmenu" role="button"><i className="fas fa-bars" /></a>
                                </li>
                                <li className="nav-item d-none d-sm-inline-block">
                                    <a className="nav-link" onClick={Home}>หน้าแรก</a>
                                </li>
                            </ul>

                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => showModal(profile)}>
                                        <i className="fa fa-cogs" />
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link">
                                        <i className="far fa-bell" />
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-widget="fullscreen" role="button">
                                        <i className="fas fa-expand-arrows-alt" />
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={logOut}>
                                        <i className="fas fa-sign-out-alt" />
                                    </a>
                                </li>
                            </ul>

                            {/* //------------------------------------------------------------------------------------------------------------------------ START EDIT PASSWORD */}
                            <Modal title="เปลี่ยนรหัสผ่าน" footer={null} visible={editPassword} onOk={handleOk} onCancel={handleCancel}>

                                {typeCheck == 0 ?
                                    <>
                                        <div className="form-group col-lg-12 col-12">
                                            <label htmlFor="passwordOld">รหัสผ่านเดิม</label>
                                            <input type="password" className="form-control" id="passwordOld" placeholder="รหัสผ่านเดิม"
                                                onChange={e => {
                                                    setinputPassword(e.target.value)
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-lg-12 col-12">
                                            <button className='btn btn-info btn-sm btn-block' onClick={onCheck}>ยืนยัน</button>
                                        </div>
                                    </>
                                    : <>
                                        <div className='row'>
                                            <div className="form-group col-lg-12 col-12">
                                                <label htmlFor="passwordNew">รหัสผ่านใหม่</label>

                                                <input type="password" className="form-control" id="passwordNew" placeholder="รหัสผ่านใหม่"
                                                    onChange={e => {
                                                        setpasswordNew({ ...passwordNew, newPassword: e.target.value })
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-lg-12 col-12">
                                                <label htmlFor="passwordConfirm">ยืนยันรหัสผ่านใหม่ </label>
                                                <input type="password" className="form-control" id="passwordConfirm" placeholder="ยืนยันรหัสผ่านใหม่"
                                                    onChange={e => {
                                                        setpasswordNew({ ...passwordNew, newPasswordConfrim: e.target.value })
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-lg-12 col-12">
                                                <button className='btn btn-info btn-sm btn-block' onClick={handleOk}>บันทึก</button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </Modal>
                            {/* //------------------------------------------------------------------------------------------------------------------------ START EDIT PASSWORD */}

                        </nav>
                        {/* --------------------------------------------------------------------------------------------------------------------------------------------- NAV */}

                        {/* --------------------------------------------------------------------------------------------------------------------------------------------- SIDEBAR */}
                        <aside className="main-sidebar sidebar-dark-primary elevation-4">
                            <a className="brand-link" onClick={Home}>
                                <img src="static/dist/img/logo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                                <span className="brand-text font-weight-light">วางแผนโครงการ</span>
                            </a>
                            <div className="sidebar">
                                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                                    <div className="image">
                                        <img src="static/dist/img/default.jpg" className="img-circle elevation-2" alt="User Image" />
                                    </div>
                                    <div className="info">
                                        <a className="d-block" onClick={Home}>{profile.fullname}</a>
                                    </div>
                                </div>
                                <nav className="mt-2">
                                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                        <li className="nav-header">Setting And Control</li>
                                        <li className="nav-item">
                                            <a className={path == 'controluser' ? 'nav-link active' : 'nav-link'} onClick={ControlUser}>
                                                <i className="nav-icon fa fa-cogs" />
                                                <p>
                                                    จัดการผู้ใช้งาน
                                                </p>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={path == 'controldept' ? 'nav-link active' : 'nav-link'} onClick={ControlDept}>
                                                <i className="nav-icon fa fa-cogs" />
                                                <p>
                                                    จัดการรายชื่อแผนก
                                                </p>
                                            </a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={path == 'add-plan' ? 'nav-link active' : 'nav-link'} onClick={AddPlan}>
                                                <i className="nav-icon fa fa-upload" />
                                                <p>
                                                    เพิ่มแผนการปฏิบัติงาน
                                                </p>
                                            </a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={path == 'approves' ? 'nav-link active' : 'nav-link'} onClick={Approves}>
                                                <i className="nav-icon fa fa-sitemap" />
                                                <p>
                                                    งานประกัน
                                                </p>
                                            </a>
                                        </li>
                                        {/* <li className="nav-item">
                                            <a className='nav-link' href='static/dist/manual/manual.pdf' target={'_blank'} rel="noreferrer">
                                                <i className="nav-icon fa fa-file-pdf" />
                                                <p>
                                                    คู่มือการใช้งานระบบ
                                                </p>
                                            </a>
                                        </li> */}
                                    </ul>
                                </nav>
                            </div>
                        </aside>
                        {/* --------------------------------------------------------------------------------------------------------------------------------------------- SIDEBAR */}

                        {/* --------------------------------------------------------------------------------------------------------------------------------------------- CONTENT */}
                        <div className="content-wrapper">
                            {
                                path == 'controluser' ? <Controluser data={profile} />
                                    : path == 'controldept' ? <Deptadd data={profile} />
                                        : path == 'add-plan' ? <Planadd data={profile} />
                                            : path == 'approves' ? <Approve data={profile} />
                                                : <Dashboard />
                            }
                        </div>
                        {/* --------------------------------------------------------------------------------------------------------------------------------------------- CONTENT */}

                        {/* --------------------------------------------------------------------------------------------------------------------------------------------- FOOTER */}
                        <footer className="main-footer">
                            <strong>Copyright © 2021 - {moment().format("YYYY")} <a href='https://www.facebook.com/profile.php?id=100080703297745' target={'_blank'} rel="noreferrer">กนต์ธร โทนทรัพย์</a> All rights reserved.</strong>
                            <div className="float-right d-none d-sm-inline-block">
                                <b>Version</b> 0.0.1
                            </div>
                        </footer>
                        {/* --------------------------------------------------------------------------------------------------------------------------------------------- FOOTER */}
                    </div>
            }
        </div>
    )
}

export default Main