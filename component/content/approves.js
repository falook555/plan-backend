import { MDBDataTableV5 } from 'mdbreact'
import React, { useEffect, useState } from 'react'
import { Modal, Popconfirm } from 'antd'
import axios from 'axios'
import config from '../../config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import * as moment from 'moment';
import 'moment/locale/th';
moment.locale('th')
// pull 30/10/65
const api = config.api

const Approve = (data) => {

    const router = useRouter()

    // ---------------------------------------------------------------------------------------------------- START DATATABLE
    const [datatable, setDatatable] = React.useState({})
    const [FormPlanById, setFormPlanById] = useState({ ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '', aph_status: '' })
    const [formDiscuss, setFormDiscuss] = useState({ username: '', id: '', status: 0, note: '', type_name: '', no: '' })
    const [openPlanById, setopenPlanById] = useState(false)
    const [openTimeline, setOpenTimeline] = useState(false)
    // ---------------------------------------------------------------------------------------------------- START GET DATA DETAIL
    const [dataActivityARR, setDataActivityARR] = useState([])
    const [dataPSIARR, setDataPSIARR] = useState([])
    const [dataTargetARR, setDataTargetARR] = useState([])
    const [dataBSARR, setDataBSARR] = useState([])
    const [dataBUDARR, setDataBUDARR] = useState([])
    const [dataApprove, setDataApprove] = useState([])

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

    //--------------------------------------------------------- FUNCTION จำนวนเงินตัวหนังสือ -----------------------------------------------------------//
    function ThaiNumberToText(Number) {
        Number = Number.replace(/๐/gi, '0');
        Number = Number.replace(/๑/gi, '1');
        Number = Number.replace(/๒/gi, '2');
        Number = Number.replace(/๓/gi, '3');
        Number = Number.replace(/๔/gi, '4');
        Number = Number.replace(/๕/gi, '5');
        Number = Number.replace(/๖/gi, '6');
        Number = Number.replace(/๗/gi, '7');
        Number = Number.replace(/๘/gi, '8');
        Number = Number.replace(/๙/gi, '9');
        return ArabicNumberToText(Number);
    }

    function ArabicNumberToText(Number) {
        var Number = CheckNumber(Number);
        var NumberArray = new Array("ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ");
        var DigitArray = new Array("", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน");
        var BahtText = "";
        if (isNaN(Number)) {
            return "ข้อมูลนำเข้าไม่ถูกต้อง";
        } else {
            if ((Number - 0) > 9999999.9999) {
                return "ข้อมูลนำเข้าเกินขอบเขตที่ตั้งไว้";
            } else {
                Number = Number.split(".");
                if (Number[1].length > 0) {
                    Number[1] = Number[1].substring(0, 2);
                }
                var NumberLen = Number[0].length - 0;
                for (var i = 0; i < NumberLen; i++) {
                    var tmp = Number[0].substring(i, i + 1) - 0;
                    if (tmp != 0) {
                        if ((i == (NumberLen - 1)) && (tmp == 1)) {
                            BahtText += "เอ็ด";
                        } else
                            if ((i == (NumberLen - 2)) && (tmp == 2)) {
                                BahtText += "ยี่";
                            } else
                                if ((i == (NumberLen - 2)) && (tmp == 1)) {
                                    BahtText += "";
                                } else {
                                    BahtText += NumberArray[tmp];
                                }
                        BahtText += DigitArray[NumberLen - i - 1];
                    }
                }
                BahtText += "บาท";
                if ((Number[1] == "0") || (Number[1] == "00")) {
                    BahtText += "ถ้วน";
                } else {
                    DecimalLen = Number[1].length - 0;
                    for (var i = 0; i < DecimalLen; i++) {
                        var tmp = Number[1].substring(i, i + 1) - 0;
                        if (tmp != 0) {
                            if ((i == (DecimalLen - 1)) && (tmp == 1)) {
                                BahtText += "เอ็ด";
                            } else
                                if ((i == (DecimalLen - 2)) && (tmp == 2)) {
                                    BahtText += "ยี่";
                                } else
                                    if ((i == (DecimalLen - 2)) && (tmp == 1)) {
                                        BahtText += "";
                                    } else {
                                        BahtText += NumberArray[tmp];
                                    }
                            BahtText += DigitArray[DecimalLen - i - 1];
                        }
                    }
                    BahtText += "สตางค์";
                }
                return BahtText;
            }
        }
    }

    function CheckNumber(Number) {
        var decimal = false;
        Number = Number.toString();
        Number = Number.replace(/ |,|บาท|฿/gi, '');
        for (var i = 0; i < Number.length; i++) {
            if (Number[i] == '.') {
                decimal = true;
            }
        }
        if (decimal == false) {
            Number = Number + '.00';
        }
        return Number
    }
    //--------------------------------------------------------- FUNCTION จำนวนเงินตัวหนังสือ -----------------------------------------------------------//

    // ------------------------------------------------------------------------------------------------------------------------------------------- START GET DATA DETAIL
    const getActivity = async (id) => {
        // activity
        try {
            const token = localStorage.getItem('token')
            const resActivity = await axios.get(`${api}/get-activity-by-id/${id}`, { headers: { "token": token } })
            setDataActivityARR(resActivity.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getPSI = async (id) => {
        // project-success-indicator
        try {
            const token = localStorage.getItem('token')
            const resPSI = await axios.get(`${api}/get-project-success-indicator-by-id/${id}`, { headers: { "token": token } })
            setDataPSIARR(resPSI.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getTarget = async (id) => {
        // target
        try {
            const token = localStorage.getItem('token')
            const resTarget = await axios.get(`${api}/get-target-by-id/${id}`, { headers: { "token": token } })
            setDataTargetARR(resTarget.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getBS = async (id) => {
        // budget-source
        try {
            const token = localStorage.getItem('token')
            const resBS = await axios.get(`${api}/get-budget-source-by-id/${id}`, { headers: { "token": token } })
            setDataBSARR(resBS.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getBUD = async (id) => {
        // budget-usage-detail
        try {
            const token = localStorage.getItem('token')
            const resBUD = await axios.get(`${api}/get-budget-usage-detail-by-id/${id}`, { headers: { "token": token } })
            setDataBUDARR(resBUD.data)
        } catch (error) {
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------- END GET DATA DETAIL



    const columns = [
        {
            label: '#',
            field: 'id',
        },
        {
            label: 'รหัสโครงการ',
            field: 'aph_plan_id',
        },
        {
            label: 'ยุทธศาสตร์กระทรวง',
            field: 'aph_ministry_strategy',
        },
        {
            label: 'สอดคล้องกับนโยบายปลัดกระทรวง',
            field: 'aph_policy',
        },
        {
            label: 'ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข',
            field: 'aph_kpi',
        },
        {
            label: 'กลยุทธ์',
            field: 'aph_strategy',
        },
        {
            label: 'ผลลัพธ์/ผลผลิต',
            field: 'aph_result',
        },
        {
            label: 'โครงการ/กิจกรรม',
            field: 'aph_project',
        },
        {
            label: 'รวมงบประมาณทั้งโครงการ',
            field: 'aph_total_budget',
        },
        {
            label: 'กำหนดระยะเวลาในการดำเนินการ',
            field: 'aph_period',
        },
        {
            label: 'หน่วยงานรับผิดชอบ',
            field: 'aph_responsible_agency',
        },
        {
            label: 'สถานะ',
            field: 'status',
        },
        {
            label: 'จัดการ',
            field: 'action',
        },
    ]

    // pull
    //---------------------------------------------------------------------------------------------------------------------------- START GET DATA
    const getList = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-plan-all`, { headers: { "token": token } })
            // console.log(res)
            const dataInfo = []
            res.data.map((item, i) => {
                // console.log(item)
                dataInfo.push(
                    {
                        'id': i + 1,
                        'aph_plan_id': item.aph_plan_id,
                        'aph_ministry_strategy': item.exc4,
                        'aph_policy': item.plan2,
                        'aph_kpi': item.indicator,
                        'aph_strategy': item.plan1,
                        'aph_result': item.aph_result,
                        'aph_project': item.project,
                        'aph_total_budget': item.aph_total_budget,
                        'aph_period': item.aph_period,
                        'aph_responsible_agency': item.aph_responsible_agency,
                        'status': (<><a onClick={() => showModalOpenTimeline(item.id)}>{item.aph_status == '1' ? 'ผ่านอนุมัติแผน' : item.aph_status == '2' ? 'ผ่านอนุมัติโครงการ' : item.aph_status == '3' ? 'สรุปโครงการ' : item.aph_status == '4' ? 'จบโครงการ' : item.aph_status == '9' ? 'ไม่ผ่าน' : 'รออนุมัติ'}</a></>),
                        'action': (
                            <>
                                <div className="btn-group">
                                    <button type="button" className='btn btn-info btn-sm' onClick={() => showModalOpenPlanById(item.id)}>
                                        <i className='fas fa-eye' />
                                    </button>
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

    const getApproveStatus = async (id) => {
        // activity
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-approve-plan-by-id/${id}`, { headers: { "token": token } })
            setDataApprove(res.data)
        } catch (error) {
            console.log(error)
        }
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL PLAN BY ID
    const showModalOpenPlanById = async (id) => {
        console.log(data)
        setopenPlanById(true)
        console.log(id)

        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-plan-by-id/${id}`, { headers: { "token": token } })
            // console.log(res.data)
            res.data.map((item, i) => {
                // console.log(item)

                setFormDiscuss({
                    ...formDiscuss,
                    username: data.data.username,
                    id: id,
                    type_name: item.type_name,
                    no: item.aph_plan_id
                })
                setFormPlanById({
                    ...FormPlanById,
                    ministry_strategy: item.exc4,
                    policy: item.plan2,
                    kpi: item.indicator,
                    strategy: item.plan1,
                    result: item.aph_result,
                    project: item.project,
                    total_budget: item.aph_total_budget,
                    period: item.aph_period,
                    responsible_agency: item.aph_responsible_agency,
                    aph_status: item.aph_status
                })
            })

        } catch (error) {
            console.log(error)
        }

        getActivity(id)
        getPSI(id)
        getTarget(id)
        getBS(id)
        getBUD(id)
        // console.log(formDiscuss)
    }

    const handleOkOpenPlanById = async () => {
        try {
            const token = localStorage.getItem('token')
            let resUSP = await axios.post(`${api}/update-status-plan`, formDiscuss, { headers: { "token": token } })

            let res = await axios.post(`${api}/approve-status-plan`, formDiscuss, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('ปรับสถานะแผนการปฏิบัติงานสำเร็จ') : toast.error('ปรับสถานะล้มเหลว')
            setFormDiscuss({ username: '', id: '', status: 0, note: '' })
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
        setopenPlanById(false)
    }

    const handleCancelOpenPlanById = () => {
        setopenPlanById(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL PLAN BY ID

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL TIMELINE
    const showModalOpenTimeline = async (id) => {
        console.log(id)
        getApproveStatus(id)
        setOpenTimeline(true)
    }

    const handleCancelOpenTimeline = () => {
        setOpenTimeline(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL TIMELINE


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
                            <h1 className="m-0">งานประกัน</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">หน้าแรก</li>
                                <li className="breadcrumb-item">งานประกัน</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    <div className="card card-warning">
                        <div className='card-body p-0'>
                            <div className="table-responsive-lg">
                                <MDBDataTableV5 hover entriesOptions={[10, 20, 30, 40, 50]} entries={10} pagesAmount={4} data={datatable} fullPagination />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL OPEN VIEW*/}
            <Modal title={null} visible={openPlanById} onOk={handleOkOpenPlanById} onCancel={handleCancelOpenPlanById} okText='บันทึก' cancelText='ยกเลิก' width={2500}>
                <>
                    <p className='text-center text-bold'>แผนปฏิบัติการ ประจำปีงบประมาณ 2565 เครือข่ายสุขภาพอำเภอบ้านด่านลานหอย</p>
                    <span><b>ยุทธศาสตร์กระทรวง : </b> {FormPlanById.ministry_strategy} </span><br />
                    <span><b>สอดคล้องกับนโยบายปลัดกระทรวง : </b> {FormPlanById.policy}</span><br />
                    <span><b>ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข : </b> {FormPlanById.kpi}</span><br />
                    <span><b>กลยุทธ์ : </b> {FormPlanById.strategy}</span><br />
                    <span><b>ผลลัพธ์/ผลผลิต : </b> {FormPlanById.result}</span>
                    <div className="card-body p-0">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
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
                                    {/** โครงการ/กิจกรรม */}
                                    <td width={'10%'}>
                                        {FormPlanById.project}
                                    </td>
                                    {/** กิจกรรมตามโครงการ */}
                                    <td width={'15%'}>
                                        {
                                            dataActivityARR.map((item1, i1) => {
                                                // console.log(item1)
                                                return <p className='mt-2' key={i1} >
                                                    {i1 + 1}) {item1.dt_activity}
                                                </p>
                                            })
                                        }

                                    </td>
                                    {/** ตัวชี้วัดความสำเร็จโครงการ */}
                                    <td width={'15%'}>
                                        {
                                            dataPSIARR.map((item2, i2) => {
                                                return <p className='mt-2' key={i2} >
                                                    {i2 + 1}) {item2.dt_project_success_indicator}
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** เป้าหมาย/จำนวน(ระบุพื้นที่/กลุ่มคน) */}
                                    <td width={'15%'}>
                                        {
                                            dataTargetARR.map((item3, i3) => {
                                                return <p className='mt-2' key={i3} >
                                                    {i3 + 1}) {item3.dt_target}
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** แหล่งงบประมาณ */}
                                    <td width={'10%'}>
                                        {
                                            dataBSARR.map((item4, i4) => {
                                                return <p className='mt-2' key={i4} >
                                                    {i4 + 1}) {item4.dt_budget_source}
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** รายละเอียดการใช้งบประมาณ (บาท) */}
                                    <td width={'15%'}>
                                        {
                                            dataBUDARR.map((item5, i5) => {
                                                return <p className='mt-2' key={i5} >
                                                    {i5 + 1}) {item5.dt_budget_usage_detail} เป็นเงิน {item5.dt_budget_usage_price} บาท
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** รวมงบประมาณทั้งโครงการ */}
                                    <td width={'6%'}>{FormPlanById.total_budget}</td>
                                    {/** การกำหนดระยะเวลาในการดำเนินการ */}
                                    <td width={'7%'}>{FormPlanById.period}</td>
                                    {/** หน่วยงานรับผิดชอบ */}
                                    <td width={'7%'}>{FormPlanById.responsible_agency}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className='text-center'>
                                    <th colSpan={6}>
                                        รวมงบประมาณหน้านี้
                                    </th>
                                    <th colSpan={1}>
                                        {FormPlanById.total_budget}
                                    </th>
                                    <th colSpan={2}>
                                        {/* {ArabicNumberToText(FormPlanById.total_budget)} */}

                                        {ArabicNumberToText(FormPlanById.total_budget)}
                                    </th>
                                </tr>
                                <tr className='text-center'>
                                    <th colSpan={6}>
                                        รวมงบประมาณพันยอด (งบประมาณรวมหน้าก่อน + งบประมาฯหน้านี้)
                                    </th>
                                    <th colSpan={1}>
                                        {FormPlanById.total_budget}
                                    </th>
                                    <th colSpan={2}>

                                        {ArabicNumberToText(FormPlanById.total_budget)}

                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                        {/* {console.log(formDiscuss)} */}
                        <div className='row mt-3'>
                            <div className='col-6'>
                                <div className='card' style={{ backgroundColor: '#f7faf9' }}>
                                    <div className='card-header border-0'>
                                        <center>
                                            <h1 style={{ fontSize: '700%', marginTop: '70px', color: 'green', height: '172px' }}>
                                                <b>
                                                    {FormPlanById.aph_status == '1' ? 'ผ่านอนุมัติแผน' : FormPlanById.aph_status == '2' ? 'ผ่านอนุมัติโครงการ' : FormPlanById.aph_status == '3' ? 'สรุปโครงการ' : FormPlanById.aph_status == '4' ? 'จบโครงการ' : FormPlanById.aph_status == '9' ? 'ไม่ผ่าน' : 'รออนุมัติ'}
                                                </b>
                                            </h1>
                                        </center>
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='card' style={{ backgroundColor: '#f7faf9' }}>
                                    <div className='card-header border-0'>
                                        <div className='form-group'>
                                            <label><h4><b>พิจารณาโครงการ</b></h4></label>
                                            <select className="browser-default custom-select"
                                                value={formDiscuss.status}
                                                onChange={e => {
                                                    setFormDiscuss({ ...formDiscuss, status: e.target.value })
                                                }}
                                            >
                                                <option value='0'>
                                                    กรุณาเลือก
                                                </option>
                                                <option value='9'>
                                                    ไม่ผ่าน
                                                </option>
                                                <option value='1'>
                                                    ผ่านอนุมัติแผน
                                                </option>
                                                <option value='2'>
                                                    ผ่านอนุมัติโครงการ
                                                </option>
                                                <option value='3'>
                                                    สรุปโครงการ
                                                </option>
                                                <option value='4'>
                                                    จบโครงการ
                                                </option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label><h4><b>เนื่องจาก...</b></h4></label>
                                            <textarea rows="5" cols="50" className="form-control" type="text" placeholder="เนื่องจาก..."
                                                value={formDiscuss.note}
                                                onChange={e => {
                                                    setFormDiscuss({ ...formDiscuss, note: e.target.value })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            </Modal>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL OPEN VIEW*/}


            {/* // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL TIMELINE */}
            <Modal title={null} visible={openTimeline} onCancel={handleCancelOpenTimeline} footer={false} width={1000}>
                <>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="timeline">

                                    <div className="time-label">
                                        <span className="bg-yellow">เริ่มโครงการ</span>
                                    </div>

                                    {
                                        dataApprove.map((item, i) => {
                                            console.log(item)
                                            return <div key={i}>
                                                <i className="fas fa-user bg-green" />
                                                <div className="timeline-item">
                                                    <span className="time"><i className="fas fa-clock" /> {moment(item.apv_upDt).add(543, 'year').format('LLLL')}</span>
                                                    <h3 className="timeline-header no-border">
                                                        <span><b>ผู้พิจารณา : </b>{item.apv_upBy}</span><br />
                                                        <span><b>สถานะ : </b>{item.apv_status == '1' ? 'ผ่านอนุมัติแผน' : item.apv_status == '2' ? 'ผ่านอนุมัติโครงการ' : item.apv_status == '3' ? 'สรุปโครงการ' : item.apv_status == '4' ? 'จบโครงการ' : item.apv_status == '9' ? 'ไม่ผ่าน' : 'รออนุมัติ'}<br />
                                                        </span><b>หมายเหตุ : </b><span>{item.apv_note} </span></h3>
                                                </div>
                                            </div>
                                        })
                                    }


                                    <div className="time-label">
                                        <span className="bg-green">จบโครงการ</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            </Modal>
            {/* // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL TIMELINE */}


        </div>
    )
}

export default Approve