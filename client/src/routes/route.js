export const ROUTE = {
  // 🌐 Public Routes
  home: '/',
  posts: '/posts',
  postDetail: (id = ':id') => `/post/${id}`,
  tag: (tag = ':tag') => `/tag/${tag}`,
  search: '/search',

  // 👤 Auth
  login: '/auth/login',
  register: '/auth/register',
  verify: '/auth/verify',
  forgotPassword: '/forgot-password',            // added missing leading slash
  resetPassword: (token = ':token') => `/reset-password/${token}`,

  // 📝 User Post Actions
  createPost: '/create',
  postDetails: (id = ':id') => `/post/${id}`,     // maybe redundant with postDetail
  editPost: (id = ':id') => `/edit/${id}`,

  // 🙍‍♂️ Profile
  completeProfile: '/complete-profile',
  userProfile: (username = ':username') => `/profile/${username}`,
  myProfile: '/me',
  messageList: '/messages',                        // messages list page
  message: (username = ':username') => `/messages/${username}`,  // conversation page

  notifications: '/notifications',

  // 📂 Media
  mediaManager: '/media',

  // 📊 Admin
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminUsers: '/admin/users',
  adminPosts: '/admin/posts',
  adminMedia: '/admin/media',
  adminComments: '/admin/comments',
  adminNotifications: '/admin/notifications',

  // 📃 Misc
  about: '/about',
  contact: '/contact',
  notFound: '*',
};
