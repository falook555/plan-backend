import { MDBDataTableV5 } from 'mdbreact'
import React, { useEffect, useState } from 'react'
import { Modal, Popconfirm } from 'antd'
import axios from 'axios'
import config from '../../config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import { Select } from 'antd';

const api = config.api

const Planadd = (data) => {

    const router = useRouter()
    const { Option } = Select;
    // ---------------------------------------------------------------------------------------------------- START DATATABLE
    const [datatable, setDatatable] = React.useState({})

    // ---------------------------------------------------------------------------------------------------- START MODAL
    const [openPlanById, setopenPlanById] = useState(false)
    const [Add, setAdd] = useState(false)
    const [Edit, setEdit] = useState(false)
    const [openTimeline, setOpenTimeline] = useState(false)

    // ---------------------------------------------------------------------------------------------------- START ADD, EDIT, GET BY ID
    const [FormAddPlan, setFormAddPlan] = useState({ insBy: data.data.username, ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
    const [FormEditPlan, setFormEditPlan] = useState({ id: '', upBy: data.data.username, ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
    const [FormPlanById, setFormPlanById] = useState({ ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
    const [statusHeadPlan, setStatusHeadPlan] = useState('')

    // ---------------------------------------------------------------------------------------------------- START GET DATA DETAIL
    const [dataActivityARR, setDataActivityARR] = useState([])
    const [dataPSIARR, setDataPSIARR] = useState([])
    const [dataTargetARR, setDataTargetARR] = useState([])
    const [dataBSARR, setDataBSARR] = useState([])
    const [dataBUDARR, setDataBUDARR] = useState([])

    // ---------------------------------------------------------------------------------------------------- START ADD DETAIL PLAN + BLOCK BUTTON
    const [blockActivity, setBlockActivity] = useState(true)
    const [blockPSI, setBlockPSI] = useState(true)
    const [blockTarget, setBlockTarget] = useState(true)
    const [blockBS, setBlockBS] = useState(true)
    const [blockBUD, setBlockBUD] = useState(true)

    const [Activity, setActivity] = useState({ id_head: '', detail: '' })
    const [PSI, setPSI] = useState({ id_head: '', detail: '' })
    const [Target, setTarget] = useState({ id_head: '', detail: '' })
    const [BS, setBS] = useState({ id_head: '', detail: '' })
    const [BUD, setBUD] = useState({ id_head: '', detail: '', price: '' })

    // ---------------------------------------------------------------------------------------------------- START GET DATA SELECT
    const [data4excAllARR, setData4excAllARR] = useState([])
    const [dataPlanByIdARR, setDataPlanByIdARR] = useState([])
    const [dataProjectByIdARR, setDataProjectByIdARR] = useState([])
    const [dataIndicatorByIdARR, setDataIndicatorByIdARR] = useState([])
    const [dataPolicy, setDataPolicy] = useState([])

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
        get4excAll()
        var thaibath = ArabicNumberToText('546')
        console.log(thaibath)
    }, [])

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

                                    <button type="button" className='btn btn-warning btn-sm' onClick={() => showModalEDIT(item.id)} >
                                        <i className='fas fa-edit' />
                                    </button>
                                    {
                                        item.aph_status == 0 ?
                                            <Popconfirm
                                                title="คุณต้องการลบแผนกนี้หรือไม่?"
                                                onConfirm={() => deletePlanHead(item.id)}
                                                okText="ยืนยัน"
                                                cancelText="ยกเลิก"
                                            >
                                                <button type="button" className="btn btn-danger btn-sm">
                                                    <i className="fa fa-trash" />
                                                </button>
                                            </Popconfirm>
                                            : ''
                                    }
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

    const deletePlanHead = async (id) => {

        let data = {
            'id': id
        }

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/delete-plan-head`, data, { headers: { "token": token } })
            // console.log(res.data)
            res.data.status == 'success' ? toast.success('ลบข้อมูลสำเร็จ') : toast.error('การลบข้อมูลล้มเหลว')
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL TIMELINE
    const showModalOpenTimeline = async (id) => {
        // console.log(id)
        setOpenTimeline(true)
    }

    const handleCancelOpenTimeline = () => {
        setOpenTimeline(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL TIMELINE


    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL ADD
    const showModalADD = () => {
        setAdd(true)
    }

    const handleOkADD = async () => {
        setAdd(false)

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/add-plan`, FormAddPlan, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('เพิ่มแผนการปฏิบัติงานสำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว')
            setFormAddPlan({ insBy: data.data.username, ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const handleCancelADD = () => {
        setAdd(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL ADD


    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL EDIT
    const showModalEDIT = async (id) => {
       
        setEdit(true)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-plan-by-id/${id}`, { headers: { "token": token } })
            // console.log(res.data)

            res.data.map((item, i) => {
                console.log(item.aph_ministry_strategy)
                Change_ministry_strategy_Edit(item.aph_ministry_strategy)
                setFormEditPlan({
                    ...FormEditPlan,
                    id: item.id,
                    ministry_strategy: item.aph_ministry_strategy,
                    policy: item.aph_policy,
                    kpi: item.aph_kpi,
                    strategy: item.aph_strategy,
                    result: item.aph_result,
                    project: item.aph_project,
                    total_budget: item.aph_total_budget,
                    period: item.aph_period,
                    responsible_agency: item.aph_responsible_agency
                })
            })

        } catch (error) {
            console.log(error)
        }
    }

    const handleOkEDIT = async () => {
        setEdit(false)
        // console.log(FormEditPlan)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/update-plan`, FormEditPlan, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('แก้ไขแผนการปฏิบัติงานสำเร็จ') : toast.error('การแก้ไขข้อมูลล้มเหลว')
            setFormEditPlan({ id: '', upBy: data.data.username, ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const handleCancelEDIT = () => {
        setEdit(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL EDIT


    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL PLAN BY ID
    const showModalOpenPlanById = async (id) => {
        setopenPlanById(true)
        // console.log(id)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-plan-by-id/${id}`, { headers: { "token": token } })
            // console.log(res.data)
            res.data.map((item, i) => {
                // console.log(item)
                setStatusHeadPlan(item.aph_status)
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
                    responsible_agency: item.aph_responsible_agency
                })

                setActivity({ ...Activity, id_head: item.id })
                setPSI({ ...PSI, id_head: item.id })
                setTarget({ ...Target, id_head: item.id })
                setBS({ ...BS, id_head: item.id })
                setBUD({ ...BUD, id_head: item.id })
            })

        } catch (error) {
            console.log(error)
        }

        getActivity(id)
        getPSI(id)
        getTarget(id)
        getBS(id)
        getBUD(id)
    }

    const handleCancelOpenPlanById = () => {
        setopenPlanById(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL PLAN BY ID


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
        try {
            const token = localStorage.getItem('token')
            const resBUD = await axios.get(`${api}/get-budget-usage-detail-by-id/${id}`, { headers: { "token": token } })
            setDataBUDARR(resBUD.data)
        } catch (error) {
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------- END GET DATA DETAIL

    // ------------------------------------------------------------------------------------------------------------------------------------------- START DELETE DETAIL
    const deleteActivity = async (id, idHead) => {

        let data = {
            'id': id,
            'id_head': idHead
        }

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/delete-activity`, data, { headers: { "token": token } })
            // console.log(res.data)
            res.data.status == 'success' ? toast.success('ลบข้อมูลสำเร็จ') : toast.error('การลบข้อมูลล้มเหลว')
            getActivity(res.data.idHead)
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const deletePSI = async (id, idHead) => {

        let data = {
            'id': id,
            'id_head': idHead
        }

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/delete-psi`, data, { headers: { "token": token } })
            // console.log(res.data)
            res.data.status == 'success' ? toast.success('ลบข้อมูลสำเร็จ') : toast.error('การลบข้อมูลล้มเหลว')
            getPSI(res.data.idHead)
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const deleteTarget = async (id, idHead) => {

        let data = {
            'id': id,
            'id_head': idHead
        }

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/delete-target`, data, { headers: { "token": token } })
            // console.log(res.data)
            res.data.status == 'success' ? toast.success('ลบข้อมูลสำเร็จ') : toast.error('การลบข้อมูลล้มเหลว')
            getTarget(res.data.idHead)
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const deleteBS = async (id, idHead) => {

        let data = {
            'id': id,
            'id_head': idHead
        }

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/delete-bs`, data, { headers: { "token": token } })
            // console.log(res.data)
            res.data.status == 'success' ? toast.success('ลบข้อมูลสำเร็จ') : toast.error('การลบข้อมูลล้มเหลว')
            getBS(res.data.idHead)
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const deleteBUD = async (id, idHead) => {

        let data = {
            'id': id,
            'id_head': idHead
        }

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/delete-bud`, data, { headers: { "token": token } })
            // console.log(res.data)
            res.data.status == 'success' ? toast.success('ลบข้อมูลสำเร็จ') : toast.error('การลบข้อมูลล้มเหลว')
            getBUD(res.data.idHead)
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------- END DELETE DETAIL



    // ------------------------------------------------------------------------------------------------------------------------------------------- START ON SUBMIT ADD DETAIL
    // ------------------------------------------------------------------------------------------------------------------------------------------- START ON SUBMIT ACTIVITY
    const onSubmitActivity = async () => {
        // console.log(Activity)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/add-activity`, Activity, { headers: { "token": token } })
            // console.log(res.data.idHead)
            res.data.status == 'success' ? toast.success('เพิ่มกิจกรรมตามโครงการสำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว')
            getActivity(res.data.idHead)
            setBlockActivity(true)
            setActivity({ ...Activity, detail: '' })
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------- END ON SUBMIT ACTIVITY


    // ------------------------------------------------------------------------------------------------------------------------------------------- START ON SUBMIT PSI
    const onSubmitPSI = async () => {
        // console.log(PSI)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/add-psi`, PSI, { headers: { "token": token } })
            // console.log(res.data.idHead)
            res.data.status == 'success' ? toast.success('เพิ่มตัวชี้วัดความสำเร็จโครงการสำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว')
            getPSI(res.data.idHead)
            setBlockPSI(true)
            setPSI({ ...PSI, detail: '' })
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------- END ON SUBMIT PSI


    // ------------------------------------------------------------------------------------------------------------------------------------------- START ON SUBMIT Target
    const onSubmitTarget = async () => {
        // console.log(Target)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/add-target`, Target, { headers: { "token": token } })
            // console.log(res.data.idHead)
            res.data.status == 'success' ? toast.success('เพิ่มเป้าหมาย/จำนวน(ระบุพื้นที่/กลุ่มคน)สำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว')
            getTarget(res.data.idHead)
            setBlockTarget(true)
            setTarget({ ...Target, detail: '' })
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------- END ON SUBMIT Target


    // ------------------------------------------------------------------------------------------------------------------------------------------- START ON SUBMIT BS
    const onSubmitBS = async () => {
        // console.log(BS)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/add-bs`, BS, { headers: { "token": token } })
            // console.log(res.data.idHead)
            res.data.status == 'success' ? toast.success('เพิ่มแหล่งงบประมาณสำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว')
            getBS(res.data.idHead)
            setBlockBS(true)
            setBS({ ...BS, detail: '' })
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------- END ON SUBMIT BS


    // ------------------------------------------------------------------------------------------------------------------------------------------- START ON SUBMIT BUD
    const onSubmitBUD = async () => {
        // console.log(BUD)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/add-bud`, BUD, { headers: { "token": token } })
            // console.log(res.data.idHead)
            res.data.status == 'success' ? toast.success('เพิ่มรายละเอียดการใช้งบประมาณ (บาท)สำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว')
            getBUD(res.data.idHead)
            setBlockBUD(true)
            setBUD({ ...BUD, detail: '', price: '' })
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------- END ON SUBMIT BUD
    // ------------------------------------------------------------------------------------------------------------------------------------------- END ON SUBMIT ADD DETAIL

    //-------------------------------------------------------------------------------------------- START GET DATA SELECT
    const get4excAll = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-4exc-all`, { headers: { "token": token } })
            // console.log(res.data)
            setData4excAllARR(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getPlanByIdHead = async (id) => {
        try {
            console.log(id)
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-plan-by-id-head/${id}`, { headers: { "token": token } })
            console.log(res.data)
            setDataPlanByIdARR(res.data)
            // policy
        } catch (error) {
            console.log(error)
        }
    }

    const getProjectByIdHead = async (id) => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-project-by-id-head/${id}`, { headers: { "token": token } })
            // console.log(res.data)
            setDataProjectByIdARR(res.data)
            // policy
        } catch (error) {
            console.log(error)
        }
    }

    const getIndicatorByIdHead = async (id) => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-indicator-by-id-head/${id}`, { headers: { "token": token } })
            // console.log(res.data)
            setDataIndicatorByIdARR(res.data)
            // policy
        } catch (error) {
            console.log(error)
        }
    }
    //-------------------------------------------------------------------------------------------- END GET DATA SELECT
    const gePolicy = async (id) => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-policy`, { headers: { "token": token } })
            // console.log(res.data)
            setDataPolicy(res.data)
            // policy
        } catch (error) {
            console.log(error)
        }
    }


    //------------------------------------------------------------------------- START SELECT ADD
    const Change_ministry_strategy = (value) => {
        setFormAddPlan({
            ...FormAddPlan,
            ministry_strategy: value,
            policy: '',
            kpi: '',
            strategy: '',
            project: ''
        })
        getPlanByIdHead(value)
        getProjectByIdHead(value)
        getIndicatorByIdHead(value)
        gePolicy()
    }

    const Change_Policy = (value) => {
        setFormAddPlan({ ...FormAddPlan, policy: value })
    }

    const Change_KPI = (value) => {
        setFormAddPlan({ ...FormAddPlan, kpi: value })
    }

    const Change_Strategy = (value) => {
        setFormAddPlan({ ...FormAddPlan, strategy: value })
    }

    const Change_Project = (value) => {
        setFormAddPlan({ ...FormAddPlan, project: value })
    }
    //------------------------------------------------------------------------- END SELECT ADD
    //------------------------------------------------------------------------- START SELECT EDIT
    const Change_ministry_strategy_Edit = (value) => {
        setFormEditPlan({
            ...FormEditPlan,
            ministry_strategy: value,
            policy: '',
            kpi: '',
            strategy: '',
            project: ''
        })
        getPlanByIdHead(value)
        getProjectByIdHead(value)
        getIndicatorByIdHead(value)
    }

    const Change_Policy_Edit = (value) => {
        setFormEditPlan({ ...FormEditPlan, policy: value })
    }

    const Change_KPI_Edit = (value) => {
        setFormEditPlan({ ...FormEditPlan, kpi: value })
    }

    const Change_Strategy_Edit = (value) => {
        setFormEditPlan({ ...FormEditPlan, strategy: value })
    }

    const Change_Project_Edit = (value) => {
        setFormEditPlan({ ...FormEditPlan, project: value })
    }
    //------------------------------------------------------------------------- END SELECT EDIT

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

                        <div className='card-body p-0'>
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
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={Change_ministry_strategy}
                                    size='large'
                                    value={FormAddPlan.ministry_strategy}
                                >
                                    <Option value="">กรุณาเลือก หรือค้นหา</Option>
                                    {
                                        data4excAllARR.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.name}
                                            </Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>สอดคล้องกับนโยบายปลัดกระทรวง</label>
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={Change_Policy}
                                    size='large'
                                    value={FormAddPlan.policy}
                                >
                                    <Option value="">กรุณาเลือก หรือค้นหา</Option>
                                    {
                                        dataPolicy.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.id} {item.name}
                                            </Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข</label>
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={Change_KPI}
                                    size='large'
                                    value={FormAddPlan.kpi}
                                >
                                    <Option value="">กรุณาเลือก หรือค้นหา</Option>
                                    {
                                        dataIndicatorByIdARR.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.name}
                                            </Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>กลยุทธ์</label>
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={Change_Strategy}
                                    size='large'
                                    value={FormAddPlan.strategy}
                                >
                                    <Option value="">กรุณาเลือก หรือค้นหา</Option>
                                    {
                                        dataPlanByIdARR.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.name}
                                            </Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>ผลลัพธ์/ผลผลิต</label>
                                <input type="text" className="form-control" placeholder="ผลลัพธ์/ผลผลิต"
                                    value={FormAddPlan.result}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, result: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>โครงการ/กิจกรรม</label>
                                <input type="text" className="form-control" placeholder="รวมงบประมาณทั้งโครงการ"
                                    value={FormAddPlan.project}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, project: e.target.value })
                                    }}
                                />

                                {/* <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={Change_Project}
                                    size='large'
                                    value={FormAddPlan.project}
                                >
                                    <Option value="">กรุณาเลือก หรือค้นหา</Option>
                                    {
                                        dataProjectByIdARR.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.name}
                                            </Option>
                                        })
                                    }
                                </Select> */}
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>รวมงบประมาณทั้งโครงการ</label>
                                <input type="text" className="form-control" placeholder="รวมงบประมาณทั้งโครงการ"
                                    value={FormAddPlan.total_budget}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, total_budget: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>กำหนดระยะเวลาในการดำเนินการ</label>
                                <input type="text" className="form-control" placeholder="กำหนดระยะเวลาในการดำเนินการ"
                                    value={FormAddPlan.period}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, period: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>หน่วยงานรับผิดชอบ</label>
                                <input type="text" className="form-control" placeholder="หน่วยงานรับผิดชอบ"
                                    value={FormAddPlan.responsible_agency}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, responsible_agency: e.target.value })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* //---------------------------------------------------------------------------------------------------------------------------------------- END MODAL ADD PLAN */}

            {/* //---------------------------------------------------------------------------------------------------------------------------------------- START MODAL EDIT PLAN */}
            <Modal title="แก้ไขแผนการปฏิบัติงาน" visible={Edit} onOk={handleOkEDIT} onCancel={handleCancelEDIT} okText='บันทึก' cancelText='ยกเลิก' width={1500}>
                <div>
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group col-lg-6 col-12">

                                <label>ยุทธศาสตร์กระทรวง</label>
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={Change_ministry_strategy_Edit}
                                    size='large'
                                    value={parseInt(FormEditPlan.ministry_strategy)}
                                >
                                    <Option value="">กรุณาเลือก หรือค้นหา</Option>
                                    {
                                        data4excAllARR.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.name}
                                            </Option>
                                        })
                                    }
                                </Select>

                                {/* <input type="text" className="form-control" placeholder="ยุทธศาสตร์กระทรวง"
                                    value={FormEditPlan.ministry_strategy}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, ministry_strategy: e.target.value })
                                    }}
                                /> */}
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>สอดคล้องกับนโยบายปลัดกระทรวง</label>
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={Change_Policy_Edit}
                                    size='large'
                                    value={parseInt(FormEditPlan.policy)}
                                >
                                    <Option value="">กรุณาเลือก หรือค้นหา</Option>
                                    {
                                        dataPlanByIdARR.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.id} {item.name}
                                            </Option>
                                        })
                                    }
                                </Select>
                                {/* <input type="text" className="form-control" placeholder="สอดคล้องกับนโยบายปลัดกระทรวง"
                                    value={FormEditPlan.policy}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, policy: e.target.value })
                                    }}
                                /> */}
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข</label>
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={Change_KPI_Edit}
                                    size='large'
                                    value={parseInt(FormEditPlan.kpi)}
                                >
                                    <Option value="">กรุณาเลือก หรือค้นหา</Option>
                                    {
                                        dataIndicatorByIdARR.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.name}
                                            </Option>
                                        })
                                    }
                                </Select>
                                {/* <input type="text" className="form-control" placeholder="ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข"
                                    value={FormEditPlan.kpi}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, kpi: e.target.value })
                                    }}
                                /> */}
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>กลยุทธ์</label>
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={Change_Strategy_Edit}
                                    size='large'
                                    value={parseInt(FormEditPlan.strategy)}
                                >
                                    <Option value="">กรุณาเลือก หรือค้นหา</Option>
                                    {
                                        dataPlanByIdARR.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.name}
                                            </Option>
                                        })
                                    }
                                </Select>
                                {/* <input type="text" className="form-control" placeholder="กลยุทธ์"
                                    value={FormEditPlan.strategy}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, strategy: e.target.value })
                                    }}
                                /> */}
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>ผลลัพธ์/ผลผลิต</label>
                                <input type="text" className="form-control" placeholder="ผลลัพธ์/ผลผลิต"
                                    value={FormEditPlan.result}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, result: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>โครงการ/กิจกรรม</label>
                                <input type="text" className="form-control" placeholder="รวมงบประมาณทั้งโครงการ"
                                    value={FormAddPlan.project}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, project: e.target.value })
                                    }}
                                />
                                {/* <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={Change_Project_Edit}
                                    size='large'
                                    value={parseInt(FormEditPlan.project)}
                                >
                                    <Option value="">กรุณาเลือก หรือค้นหา</Option>
                                    {
                                        dataProjectByIdARR.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.name}
                                            </Option>
                                        })
                                    }
                                </Select> */}
                                {/* <input type="text" className="form-control" placeholder="โครงการ/กิจกรรม"
                                    value={FormEditPlan.project}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, project: e.target.value })
                                    }}
                                /> */}
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>รวมงบประมาณทั้งโครงการ</label>
                                <input type="text" className="form-control" placeholder="รวมงบประมาณทั้งโครงการ"
                                    value={FormEditPlan.total_budget}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, total_budget: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>กำหนดระยะเวลาในการดำเนินการ</label>
                                <input type="text" className="form-control" placeholder="กำหนดระยะเวลาในการดำเนินการ"
                                    value={FormEditPlan.period}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, period: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>หน่วยงานรับผิดชอบ</label>
                                <input type="text" className="form-control" placeholder="หน่วยงานรับผิดชอบ"
                                    value={FormEditPlan.responsible_agency}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, responsible_agency: e.target.value })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* //---------------------------------------------------------------------------------------------------------------------------------------- END MODAL EDIT PLAN */}

            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL OPEN VIEW*/}
            <Modal title={null} visible={openPlanById} onCancel={handleCancelOpenPlanById} footer={false} okText='บันทึก' cancelText='ยกเลิก' width={2500}>
                <>
                    <p className='text-center text-bold'>แผนปฏิบัติการ ประจำปีงบประมาณ 2565 เครือข่ายสุขภาพอำเภอบ้านด่านลานหอย</p>
                    <span><b>ยุทธศาสตร์กระทรวง : </b> {FormPlanById.ministry_strategy}</span><br />
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
                                            statusHeadPlan == 0 ? '-' :
                                                <div className='row'>
                                                    <div className='col-9'>
                                                        <input type="text" className="form-control form-control-sm" placeholder="กิจกรรมตามโครงการ"
                                                            value={Activity.detail}
                                                            onChange={e => {
                                                                setActivity({ ...Activity, detail: e.target.value })
                                                                if (e.target.value.length > 0) {
                                                                    // console.log(Activity)
                                                                    setBlockActivity(false)
                                                                } else {
                                                                    setBlockActivity(true)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='col-3'>
                                                        <button className='btn btn-info btn-block btn-sm' disabled={blockActivity} onClick={onSubmitActivity}><i className="fas fa-plus"></i></button>
                                                    </div>
                                                </div>
                                        }
                                        {
                                            dataActivityARR.map((item1, i1) => {
                                                // console.log(item1)
                                                return <p className='mt-2' key={i1} >
                                                    {i1 + 1}) {item1.dt_activity}
                                                    &emsp;<button className='btn btn-danger btn-sm' onClick={() => deleteActivity(item1.id, item1.id_head)}><i className="fa fa-trash" /></button>
                                                </p>
                                            })
                                        }

                                    </td>
                                    {/** ตัวชี้วัดความสำเร็จโครงการ */}
                                    <td width={'15%'}>
                                        {
                                            statusHeadPlan == 0 ? '-' :
                                                <div className='row'>
                                                    <div className='col-9'>
                                                        <input type="text" className="form-control form-control-sm" placeholder="ตัวชี้วัดความสำเร็จโครงการ"
                                                            value={PSI.detail}
                                                            onChange={e => {
                                                                setPSI({ ...PSI, detail: e.target.value })
                                                                if (e.target.value.length > 0) {
                                                                    // console.log(PSI)
                                                                    setBlockPSI(false)
                                                                } else {
                                                                    setBlockPSI(true)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='col-3'>
                                                        <button className='btn btn-info btn-block btn-sm' disabled={blockPSI} onClick={onSubmitPSI}><i className="fas fa-plus"></i></button>
                                                    </div>
                                                </div>
                                        }
                                        {
                                            dataPSIARR.map((item2, i2) => {
                                                return <p className='mt-2' key={i2} >
                                                    {i2 + 1}) {item2.dt_project_success_indicator}
                                                    &emsp;<button className='btn btn-danger btn-sm' onClick={() => deletePSI(item2.id, item2.id_head)}><i className="fa fa-trash" /></button>
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** เป้าหมาย/จำนวน(ระบุพื้นที่/กลุ่มคน) */}
                                    <td width={'15%'}>
                                        {
                                            statusHeadPlan == 0 ? '-' :
                                                <div className='row'>
                                                    <div className='col-9'>
                                                        <input type="text" className="form-control form-control-sm" placeholder="เป้าหมาย/จำนวน(ระบุพื้นที่/กลุ่มคน)"
                                                            value={Target.detail}
                                                            onChange={e => {
                                                                setTarget({ ...Target, detail: e.target.value })
                                                                if (e.target.value.length > 0) {
                                                                    // console.log(Target)
                                                                    setBlockTarget(false)
                                                                } else {
                                                                    setBlockTarget(true)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='col-3'>
                                                        <button className='btn btn-info btn-block btn-sm' disabled={blockTarget} onClick={onSubmitTarget}><i className="fas fa-plus"></i></button>
                                                    </div>
                                                </div>
                                        }
                                        {
                                            dataTargetARR.map((item3, i3) => {
                                                return <p className='mt-2' key={i3} >
                                                    {i3 + 1}) {item3.dt_target}
                                                    &emsp;<button className='btn btn-danger btn-sm' onClick={() => deleteTarget(item3.id, item3.id_head)}><i className="fa fa-trash" /></button>
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** แหล่งงบประมาณ */}
                                    <td width={'10%'}>
                                        {
                                            statusHeadPlan == 0 ? '-' :
                                                <div className='row'>
                                                    <div className='col-9'>
                                                        <input type="text" className="form-control form-control-sm" placeholder="แหล่งงบประมาณ"
                                                            value={BS.detail}
                                                            onChange={e => {
                                                                setBS({ ...BS, detail: e.target.value })
                                                                if (e.target.value.length > 0) {
                                                                    // console.log(BS)
                                                                    setBlockBS(false)
                                                                } else {
                                                                    setBlockBS(true)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='col-3'>
                                                        <button className='btn btn-info btn-block btn-sm' disabled={blockBS} onClick={onSubmitBS}><i className="fas fa-plus"></i></button>
                                                    </div>
                                                </div>
                                        }
                                        {
                                            dataBSARR.map((item4, i4) => {
                                                return <p className='mt-2' key={i4} >
                                                    {i4 + 1}) {item4.dt_budget_source}
                                                    &emsp;<button className='btn btn-danger btn-sm' onClick={() => deleteBS(item4.id, item4.id_head)}><i className="fa fa-trash" /></button>
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** รายละเอียดการใช้งบประมาณ (บาท) */}
                                    <td width={'15%'}>
                                        {
                                            statusHeadPlan == 0 ? '-' :
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <input type="text" className="form-control form-control-sm" placeholder="รายละเอียด"
                                                            value={BUD.detail}
                                                            onChange={e => {
                                                                setBUD({ ...BUD, detail: e.target.value })
                                                                if (e.target.value.length > 0 && BUD.price.length > 0) {
                                                                    // console.log(BUD)
                                                                    setBlockBUD(false)
                                                                } else {
                                                                    setBlockBUD(true)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='col-12 mt-2'>
                                                        <input type="text" className="form-control form-control-sm" placeholder="จำนวนเงิน"
                                                            value={BUD.price}
                                                            onChange={e => {
                                                                setBUD({ ...BUD, price: e.target.value })
                                                                if (e.target.value.length > 0 && BUD.detail.length > 0) {
                                                                    // console.log(BUD)
                                                                    setBlockBUD(false)
                                                                } else {
                                                                    setBlockBUD(true)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='col-12 mt-2'>
                                                        <button className='btn btn-info btn-block btn-sm' disabled={blockBUD} onClick={onSubmitBUD}><i className="fas fa-plus"></i></button>
                                                    </div>
                                                </div>
                                        }
                                        {
                                            dataBUDARR.map((item5, i5) => {
                                                return <p className='mt-2' key={i5} >
                                                    {i5 + 1}) {item5.dt_budget_usage_detail} เป็นเงิน {item5.dt_budget_usage_price} บาท
                                                    &emsp;<button className='btn btn-danger btn-sm' onClick={() => deleteBUD(item5.id, item5.id_head)}><i className="fa fa-trash" /></button>
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

                                    <div>
                                        <i className="fas fa-user bg-green" />
                                        <div className="timeline-item">
                                            <span className="time"><i className="fas fa-clock" /> 5 mins ago</span>
                                            <h3 className="timeline-header no-border"><a href="#">Sarah Young</a> accepted your friend request</h3>
                                        </div>
                                    </div>

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

        </div >


    )
}

export default Planadd