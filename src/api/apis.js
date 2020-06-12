import axios from 'axios'
const URL_API = 'http://127.0.0.1:5000/'

// 默认接口
axios.defaults.baseURL = URL_API

// 个人信息图片路径
export const API_ACCOUNTS_IMG = URL_API + 'upload/shop/acc_img/'

// 商品图片路径
export const API_GOODS_IMG = URL_API + 'upload/imgs/goods_img/'

// 店铺图片路径
export const API_SHOPS_IMG = URL_API + 'upload/shop/'

console.log(API_SHOPS_IMG);


//登录接口
export const API_LOGIN = (account, password) => axios.post('/users/checkLogin', { account, password })

//添加账号
export const API_ADD_ACCOUNT = (account, password, userGroup) => axios.post('/users/add', { account, password, userGroup })

//获取账号列表
export const API_ACCOUNT_LIST = (currentPage, pageSize) => axios.get('/users/list', { params: { currentPage, pageSize } })

//删除账号
export const API_DEL_ACCOUNT = (id) => axios.get('/users/del', { params: { id } })

//批量删除
export const API_BATCHDEL_ACCOUNT = (ids) => axios.get('/users/batchdel', { params: { ids } })

//编辑账号
export const API_EDIT_ACCOUNT = (id, account, userGroup) => axios.post('/users/edit', { id, account, userGroup })

//检测旧密码
export const API_CHECK_OLDPWD = (oldPwd, id) => axios.get('/users/checkoldpwd', { params: { oldPwd, id } })

//修改密码
export const API_CHANGE_PWD = (newPwd, id) => axios.post('/users/editpwd', { newPwd, id })

//个人信息
export const API_ACCOUT_INFO = (id) => axios.get('/users/accountinfo', { params: { id } })

//token过期验证
export const API_CHEAK_TOKEN = (token) => axios.get('/users/checktoken', { params: { token } })



//添加分类
export const API_ADDCATE = (cateName, state) => axios.post('/goods/addcate', { cateName, state })

//获取商品分类
export const API_GOODSCIFY_LIST = (currentPage, pageSize) => axios.get('/goods/catelist', { params: { currentPage, pageSize } })

//删除分类
export const API_DEL_GOODS_CIFY = (id) => axios.get('/goods/delcate', { params: { id } })

//修改分类
export const API_EDITCATE = (id, cateName, state) => axios.post('/goods/editcate', { id, cateName, state })

//查询所有分类名称
export const API_CATEGORIES = () => axios.get('/goods/categories')

//商品图片上传
export const API_GOODS_IMG_UPLOAD = () => axios.post('/goods/goods_img_upload')



//添加商品
export const API_GOODS_ADDED = (name, category, price, imgUrl, goodsDesc) => axios.post('/goods/add', { name, category, price, imgUrl, goodsDesc })

//获取商品列表
export const API_GOODS_LIST = (currentPage, pageSize) => axios.get('/goods/list', { params: { currentPage, pageSize } })

//删除商品
export const API_DEL_GOODS = (id) => axios.get('/goods/del', { params: { id } })

//修改商品
export const API_GOODS_EDIT = (name, category, price, imgUrl, goodsDesc, id) => axios.post('/goods/edit', { name, category, price, imgUrl, goodsDesc, id })

//获取订单列表
export const API_ORDERS_LIST = (currentPage, pageSize) => axios.get('/order/list', { params: { currentPage, pageSize } })

//查询订单
export const API_ORDER_SEARCH = (
    currentPage, pageSize, orderNo, consignee, phone, orderState, date
) => axios.get('/order/search', {
    params: {
        currentPage, pageSize, orderNo, consignee, phone, orderState, date
    }
})

//查看订单详情
export const API_ORDERS_DETAEL = (id) => axios.get('/order/detail', { params: { id } })

//修改订单
export const API_ORDER_EDIT =
    (id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState) => axios
        .post('/order/edit', { id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState })


//获取店铺详情
export const API_SHOP_INFO = () => axios.get('/shop/info', { params: {} })


//店铺修改
// export const API_SHOP_EDIT = (
//     id, name, bulletin, avatar, deliveryPrice, deliveryTime, description, score, sellCount, supports, date, pics
// ) => axios.post('/shop/edit', {
//     id, name, bulletin, avatar, deliveryPrice, deliveryTime, description, score, sellCount, supports, date, pics
// })
export const API_SHOP_EDIT = (params) => axios.post('/shop/edit', params)

//首页报表接口
export const API_TOTAL_DATA = () => axios.get('/order/totaldata', { params: {} })

//订单报表接口
export const API_ORDER_DATA = (date) => axios.get('/order/ordertotal', { params: { date } })



{/* */ }
