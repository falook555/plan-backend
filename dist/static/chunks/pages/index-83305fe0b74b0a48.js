(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5557:function(a,b,c){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return c(3678)}])},1838:function(a,b){"use strict";b.Z={api:"http://192.168.1.202:4059"}},3678:function(a,b,c){"use strict";c.r(b);var d=c(7568),e=c(1799),f=c(9396),g=c(4051),h=c.n(g),i=c(5893),j=c(7294),k=c(1163),l=c(9669),m=c.n(l),n=c(1838),o=c(2920);c(993);var p=n.Z.api,q=function(){var a,b=(0,j.useState)({username:"",password:""}),c=b[0],g=b[1],l=(0,j.useState)(""),n=l[0],q=l[1],r=(0,k.useRouter)();(0,j.useEffect)(function(){var a=localStorage.getItem("token");null==a?r.push({pathname:"/"}):(q(a),r.push({pathname:"/main",query:{path:"dashboard"}}))},[]);var s=(a=(0,d.Z)(h().mark(function a(){var b,d,e;return h().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return b=JSON.stringify({username:c.username,password:c.password}),d={headers:{"Content-Type":"application/json;charset=UTF-8","Access-Control-Allow_origin":"*"}},a.prev=2,a.next=5,m().post("".concat(p,"/signin"),b,d);case 5:e=a.sent,localStorage.setItem("token",e.data.token),r.push({pathname:"/main",query:{path:"dashboard"}}),a.next=14;break;case 10:a.prev=10,a.t0=a.catch(2),console.log(a.t0),"Bad Request"==a.t0.response.data?o.Am.error("กรุณากรอกข้อมูลให้ครบถ้วน!"):("userError"==a.t0.response.data.error.message&&o.Am.error("username ไม่ถูกต้อง!"),"passError"==a.t0.response.data.error.message&&o.Am.error("password ไม่ถูกต้อง!"),"statusError"==a.t0.response.data.error.message&&o.Am.error("คุณยังไม่ได้รับอนุญาตเข้าใช้งานระบบ"));case 14:case"end":return a.stop()}},a,null,[[2,10]])})),function(){return a.apply(this,arguments)});return(0,i.jsx)(i.Fragment,{children:null==n||""==n?(0,i.jsxs)("div",{className:"hold-transition login-page bgimg",children:[(0,i.jsx)(o.Ix,{position:"top-center",autoClose:5e3,hideProgressBar:!0,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0,theme:"colored"}),(0,i.jsx)("div",{className:"login-box",children:(0,i.jsxs)("div",{className:"card card-outline card-success",children:[(0,i.jsx)("div",{className:"card-header text-center",children:(0,i.jsx)("span",{className:"h1",children:(0,i.jsx)("b",{children:"โครงการ แผนงาน"})})}),(0,i.jsx)("form",{action:"",children:(0,i.jsxs)("div",{className:"card-body",children:[(0,i.jsxs)("div",{className:"input-group mb-3",children:[(0,i.jsx)("input",{type:"text",className:"form-control",placeholder:"Username",value:c.username,onChange:function(a){g((0,f.Z)((0,e.Z)({},c),{username:a.target.value}))}}),(0,i.jsx)("div",{className:"input-group-append",children:(0,i.jsx)("div",{className:"input-group-text",children:(0,i.jsx)("span",{className:"fas fa-user"})})})]}),(0,i.jsxs)("div",{className:"input-group mb-3",children:[(0,i.jsx)("input",{type:"password",className:"form-control",placeholder:"Password",value:c.password,onChange:function(a){g((0,f.Z)((0,e.Z)({},c),{password:a.target.value}))}}),(0,i.jsx)("div",{className:"input-group-append",children:(0,i.jsx)("div",{className:"input-group-text",children:(0,i.jsx)("span",{className:"fas fa-lock"})})})]}),(0,i.jsx)("button",{type:"submit",className:"btn btn-success btn-block",onClick:function(a){a.preventDefault(),s()},children:"เข้าสู่ระบบ"})]})})]})})]}):""})};b.default=q}},function(a){a.O(0,[703,774,888,179],function(){var b;return a(a.s=5557)}),_N_E=a.O()}])