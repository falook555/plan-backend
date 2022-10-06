import { MDBDataTableV5 } from 'mdbreact'
import React, { useEffect, useState } from 'react'
import { Modal, Popconfirm } from 'antd'
import axios from 'axios'
import config from '../../config'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import ReactInputMask from 'react-input-mask'

const api = config.api
const Planadd = (data) => {

    const router = useRouter()
    const [datatable, setDatatable] = React.useState({})
    const [openTable, setopenTable] = useState(false)
    const [Add, setAdd] = useState(false)

    useEffect(() => {
        if (data.data.status != '99') {
            router.push({
                pathname: '/main',
                query: {
                    path: 'dashboard',
                    error: 'AccessDenied'
                },
            })
        }
        getList()
    }, [])

    const subaddplan = () => {
        router.push({
            pathname: '/main',
            query: {
                path: 'sub-addplan'
            },
        })
    }

    const columns = [
        {
            label: '#',
            field: 'id',
        },
        {
            label: 'ยุทธศาสตร์กระทรวง',
            field: 'nameq',
        },
        {
            label: 'สอดคล้องกับนโยบายปลัดกระทรวง',
            field: 'namew',
        },
        {
            label: 'ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข',
            field: 'namee',
        },
        {
            label: 'กลยุทธ์',
            field: 'namer',
        },
        {
            label: 'ผลลัพธ์/ผลผลิต',
            field: 'namet',
        },
        {
            label: 'โครงการ/กิจกรรม',
            field: 'namey',
        },
        {
            label: 'รวมงบประมาณทั้งโครงการ',
            field: 'nameu',
        },
        {
            label: 'กำหนดระยะเวลาในการดำเนินการ',
            field: 'namei',
        },
        {
            label: 'หน่วยงานรับผิดชอบ',
            field: 'nameo',
        },
        {
            label: 'จัดการ',
            field: 'action',
        },
    ]
    //---------------------------------------------------------------------------------------------------------------------------- START GET DATA
    const getList = async () => {

        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-dept-all`, { headers: { "token": token } })
            // console.log(res)
            const dataInfo = []
            res.data.map((item, i) => {
                // console.log(item)
                dataInfo.push(
                    {
                        'id': i + 1,
                        'nameq': item.name.toLocaleUpperCase(),
                        'action': (
                            <>
                                <div className="btn-group">
                                    <button type="button" className='btn btn-info btn-block btn-sm' onClick={showModalOpenTable}>
                                        <i className='fas fa-eye' />
                                    </button>

                                    <button type="button" className='btn btn-warning btn-sm' >
                                        <i className='fas fa-edit' />
                                    </button>
                                    <Popconfirm
                                        title="คุณต้องการลบแผนกนี้หรือไม่?"
                                        // onConfirm={() => delelte(item.id)}
                                        okText="ยืนยัน"
                                        cancelText="ยกเลิก"
                                    >
                                        <button type="button" className="btn btn-danger btn-sm">
                                            <i className="fa fa-trash" />
                                        </button>
                                    </Popconfirm>
                                </div>
                            </>
                        )
                    }
                )
            })

            setDatatable(
                {
                    columns: columns,
                    rows: dataInfo
                }
            )
        } catch (error) {
            console.log(error)
            // toast.error('เกิดข้อผิดพลาด')
        }
    }
    //---------------------------------------------------------------------------------------------------------------------------- END GET DATA

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL ADD
    const showModalADD = () => {
        setAdd(true)
    }

    const handleOkADD = async () => {
        setAdd(false)
    }

    const handleCancelADD = () => {
        setAdd(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL ADD

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL ADD
    const showModalOpenTable = () => {
        setopenTable(true)
    }

    const handleOkOpenTable = async () => {
        setopenTable(false)
    }

    const handleCancelOpenTable = () => {
        setopenTable(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL ADD


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
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0">เพิ่มแผนการปฏิบัติงาน</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">หน้าแรก</li>
                                <li className="breadcrumb-item">เพิ่มแผนการปฏิบัติงาน</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">

                    <div className="card card-white">
                        <div className="card-header">
                            <div style={{ textAlign: 'right' }}>
                                <button type="button" className="btn btn-success btn-sm" onClick={showModalADD}>เพิ่มแผนการปฏิบัติงาน</button>
                            </div>
                        </div>

                        <div className='card-body'>
                            <div className="table-responsive-lg">
                                <MDBDataTableV5 hover entriesOptions={[10, 20, 30, 40, 50]} entries={10} pagesAmount={4} data={datatable} fullPagination />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* //---------------------------------------------------------------------------------------------------------------------------------------- START MODAL ADD PLAN */}
            <Modal title="เพิ่มแผนการปฏิบัติงาน" visible={Add} onOk={handleOkADD} onCancel={handleCancelADD} okText='บันทึก' cancelText='ยกเลิก' width={1500}>
                <div>
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group col-lg-6 col-12">
                                <label>ยุทธศาสตร์กระทรวง</label>
                                <input type="text" className="form-control" placeholder="ชื่อแผนก"
                                // value={formAddDept.nameDept}
                                //     onChange={e => {
                                //         setFormAddDept({ ...formAddDept, nameDept: e.target.value })
                                //     }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>สอดคล้องกับนโยบายปลัดกระทรวง</label>
                                <input type="text" className="form-control" placeholder="ชื่อแผนก"
                                // value={formAddDept.nameDept}
                                //     onChange={e => {
                                //         setFormAddDept({ ...formAddDept, nameDept: e.target.value })
                                //     }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข</label>
                                <input type="text" className="form-control" placeholder="ชื่อแผนก"
                                // value={formAddDept.nameDept}
                                //     onChange={e => {
                                //         setFormAddDept({ ...formAddDept, nameDept: e.target.value })
                                //     }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>กลยุทธ์</label>
                                <input type="text" className="form-control" placeholder="ชื่อแผนก"
                                // value={formAddDept.nameDept}
                                //     onChange={e => {
                                //         setFormAddDept({ ...formAddDept, nameDept: e.target.value })
                                //     }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>ผลลัพธ์/ผลผลิต</label>
                                <input type="text" className="form-control" placeholder="ชื่อแผนก"
                                // value={formAddDept.nameDept}
                                //     onChange={e => {
                                //         setFormAddDept({ ...formAddDept, nameDept: e.target.value })
                                //     }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>โครงการ/กิจกรรม</label>
                                <input type="text" className="form-control" placeholder="ชื่อแผนก"
                                // value={formAddDept.nameDept}
                                //     onChange={e => {
                                //         setFormAddDept({ ...formAddDept, nameDept: e.target.value })
                                //     }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>รวมงบประมาณทั้งโครงการ</label>
                                <input type="text" className="form-control" placeholder="ชื่อแผนก"
                                // value={formAddDept.nameDept}
                                //     onChange={e => {
                                //         setFormAddDept({ ...formAddDept, nameDept: e.target.value })
                                //     }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>กำหนดระยะเวลาในการดำเนินการ</label>
                                <input type="text" className="form-control" placeholder="ชื่อแผนก"
                                // value={formAddDept.nameDept}
                                //     onChange={e => {
                                //         setFormAddDept({ ...formAddDept, nameDept: e.target.value })
                                //     }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>หน่วยงานรับผิดชอบ</label>
                                <input type="text" className="form-control" placeholder="ชื่อแผนก"
                                // value={formAddDept.nameDept}
                                //     onChange={e => {
                                //         setFormAddDept({ ...formAddDept, nameDept: e.target.value })
                                //     }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* //---------------------------------------------------------------------------------------------------------------------------------------- END MODAL ADD PLAN */}

            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL OPEN */}
            <Modal title={null} visible={openTable} onOk={handleOkOpenTable} onCancel={handleCancelOpenTable} okText='บันทึก' cancelText='ยกเลิก' width={2500}>
                <>
                    <p className='text-center text-bold'>แผนปฏิบัติการ ประจำปีงบประมาณ 2565 เครือข่ายสุขภาพอำเภอบ้านด่านลานหอย</p>
                    <span><b>ยุทธศาสตร์กระทรวง : </b> บลาๆๆ</span><br />
                    <span><b>สอดคล้องกับนโยบายปลัดกระทรวง : </b> บลาๆๆ</span><br />
                    <span><b>ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข : </b> บลาๆๆ</span><br />
                    <span><b>กลยุทธ์ : </b> บลาๆๆ</span><br />
                    <span><b>ผลลัพธ์/ผลผลิต : </b> บลาๆๆ</span>
                    <div className="card-body p-0">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>โครงการ/กิจกรรม</th>
                                    <th>กิจกรรมตามโครงการ</th>
                                    <th>ตัวชี้วัดความสำเร็จโครงการ</th>
                                    <th>เป้าหมาย/จำนวน(ระบุพื้นที่/กลุ่มคน)</th>
                                    <th>แหล่งงบประมาณ</th>
                                    <th>รายละเอียดการใช้งบประมาณ (บาท)</th>
                                    <th>รวมงบประมาณทั้งโครงการ</th>
                                    <th>การกำหนดระยะเวลาในการดำเนินการ</th>
                                    <th>หน่วยงานรับผิดชอบ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        1.
                                    </td>
                                    <td width={'10%'}>
                                        โครงการหนูน้อยศึกษาภูมิปัญญาท้องถิ่นศูนย์พัฒนาเด็กเล็ก
                                        บ้านหนองเข้-หนองตูม
                                    </td>
                                    <td width={'20%'}>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <input type="text" className="form-control" id="test" placeholder="กิจกรรมตามโครงการ" />
                                            </div>
                                            <div className='col-3'>
                                                <button className='btn btn-info btn-block'><i class="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <p className='mt-2'>1. โครงการจัดซื้อวัสดุการศึกษาสื่อการเรียนการสอนและเครื่องเล่นพัฒนาการเด็กเล็ก
                                            ตั้งไว้125,800.00 บาท
                                            เพื่อจ่ายเป็นค่าใช้จ่ายโครงการจัดซื้อวัสดุการศึกษาสื่อการเรียนการสอนและเครื่องเล่นพัฒนาการเด็กเล็ก
                                            ตั้งจ่ายจากเงินรายได้สถานศึกษาที่องค์กรปกครองส่วนท้องถิ่นตั้งงบประมาณให้ปรากฏในแผนพัฒนาการศึกษา
                                            ห้าปี (พ.ศ.2561-2565) หน้าที่ 44
                                        </p>
                                        <p className='mt-2'>1. โครงการจัดซื้อวัสดุการศึกษาสื่อการเรียนการสอนและเครื่องเล่นพัฒนาการเด็กเล็ก
                                            ตั้งไว้125,800.00 บาท
                                            เพื่อจ่ายเป็นค่าใช้จ่ายโครงการจัดซื้อวัสดุการศึกษาสื่อการเรียนการสอนและเครื่องเล่นพัฒนาการเด็กเล็ก
                                            ตั้งจ่ายจากเงินรายได้สถานศึกษาที่องค์กรปกครองส่วนท้องถิ่นตั้งงบประมาณให้ปรากฏในแผนพัฒนาการศึกษา
                                            ห้าปี (พ.ศ.2561-2565) หน้าที่ 44
                                        </p>
                                        <p className='mt-2'>1. โครงการจัดซื้อวัสดุการศึกษาสื่อการเรียนการสอนและเครื่องเล่นพัฒนาการเด็กเล็ก
                                            ตั้งไว้125,800.00 บาท
                                            เพื่อจ่ายเป็นค่าใช้จ่ายโครงการจัดซื้อวัสดุการศึกษาสื่อการเรียนการสอนและเครื่องเล่นพัฒนาการเด็กเล็ก
                                            ตั้งจ่ายจากเงินรายได้สถานศึกษาที่องค์กรปกครองส่วนท้องถิ่นตั้งงบประมาณให้ปรากฏในแผนพัฒนาการศึกษา
                                            ห้าปี (พ.ศ.2561-2565) หน้าที่ 44
                                        </p>
                                    </td>
                                    <td width={'15%'}>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <input type="text" className="form-control" id="test" placeholder="กิจกรรมตามโครงการ" />
                                            </div>
                                            <div className='col-3'>
                                                <button className='btn btn-info btn-block'><i class="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <p className='mt-2'>เพื่อสร้างความเข้าใจและข้อตกลงร่วมกันระหว่างผู้ปกครองและศูนย์พัฒนาเด็กเล็ก</p>
                                        <p className='mt-2'>เพื่อสร้างความเข้าใจและข้อตกลงร่วมกันระหว่างผู้ปกครองและศูนย์พัฒนาเด็กเล็ก</p>
                                        <p className='mt-2'>เพื่อสร้างความเข้าใจและข้อตกลงร่วมกันระหว่างผู้ปกครองและศูนย์พัฒนาเด็กเล็ก</p>
                                    </td>
                                    <td width={'15%'}>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <input type="text" className="form-control" id="test" placeholder="กิจกรรมตามโครงการ" />
                                            </div>
                                            <div className='col-3'>
                                                <button className='btn btn-info btn-block'><i class="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <p className='mt-2'>เพื่อสร้างความเข้าใจและข้อตกลงร่วมกันระหว่างผู้ปกครองและศูนย์พัฒนาเด็กเล็ก</p>
                                        <p className='mt-2'>เพื่อสร้างความเข้าใจและข้อตกลงร่วมกันระหว่างผู้ปกครองและศูนย์พัฒนาเด็กเล็ก</p>
                                        <p className='mt-2'>เพื่อสร้างความเข้าใจและข้อตกลงร่วมกันระหว่างผู้ปกครองและศูนย์พัฒนาเด็กเล็ก</p>
                                    </td>
                                    <td width={'15%'}>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <input type="text" className="form-control" id="test" placeholder="กิจกรรมตามโครงการ" />
                                            </div>
                                            <div className='col-3'>
                                                <button className='btn btn-info btn-block'><i class="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <p className='mt-2'>ใช้งบประมาณ อบต.</p>
                                    </td>
                                    <td width={'15%'}>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <input type="text" className="form-control" id="test" placeholder="กิจกรรมตามโครงการ" />
                                            </div>
                                            <div className='col-3'>
                                                <button className='btn btn-info btn-block'><i class="fas fa-plus"></i></button>
                                            </div>
                                        </div>

                                        <p className='mt-2'>
                                            1 .โครงการค่าจัดการศึกษา (ค่าหนังสือเรียน,ค่าอุปกรณ์การเรียน,ค่าเครื่องแบบนักเรียน,
                                            ค่ากิจกรรมพัฒนาผู้เรียน) ตั้งไว้48,590.00 บาท
                                        </p>
                                        <p className='mt-2'>
                                            1 .โครงการค่าจัดการศึกษา (ค่าหนังสือเรียน,ค่าอุปกรณ์การเรียน,ค่าเครื่องแบบนักเรียน,
                                            ค่ากิจกรรมพัฒนาผู้เรียน) ตั้งไว้48,590.00 บาท
                                        </p>
                                    </td>
                                    <td >100,000.00</td>
                                    <td>มกราคม 2565 - มกราคม 2566</td>
                                    <td width={'10%'}>กนต์ธร โทนทรัพย์</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className='text-center'>
                                    <th colSpan={7}>
                                        รวมงบประมาณหน้านี้
                                    </th>
                                    <th colSpan={1}>
                                        100,000.00
                                    </th>
                                    <th colSpan={2}>
                                        หนึ่งแสนบาทถ้วน
                                    </th>
                                </tr>
                                <tr className='text-center'>
                                    <th colSpan={7}>
                                        รวมงบประมาณพันยอด (งบประมาณรวมหน้าก่อน + งบประมาฯหน้านี้)
                                    </th>
                                    <th colSpan={1}>
                                        100,000.00
                                    </th>
                                    <th colSpan={2}>
                                        หนึ่งแสนบาทถ้วน
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </>
            </Modal>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL OPEN */}

        </div>


    )
}

export default Planadd