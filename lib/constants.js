const STATUS_CODE = {
    ERROR: 0,
    SUCCESS: 1
};

const ACCOUNT_LEVEL = {
    SUPERADMIN: 1,
    ADMIN: 2,
    USER: 3,
    GUEST: 4
};

const ACCOUNT_TYPE = {
    SUPERADMIN: "SUPERADMIN",
    ADMIN: "ADMIN",
    USER: 'ENDUSER',
    GUEST: 'GUESTUSER'
}

const USER_PROGRESS = {
    PROGRESS_1: 1,
    PROGRESS_2: 2,
    PROGRESS_3: 3,
    PROGRESS_4: 4

}


const LEVEL = {
    HIGH: "HIGH",
    MEDIUM: "MEDIUM",
    LOW: "LOW"
}

const CMS_TYPE = {
    ABOUT_US: "About Us",
    PRIVACY_POLICY: "Privacy Policy",
    TERM_CONDITIONS: "Term & Conditions",
    CONTACTUS: "Contact Us",
    BLOG: "Blog",
    FAQ: "FAQ"
}

const NOTIFICATION_TYPE = {
    EMAIL: "EMAIL",
    NOTIFICATION: "NOTIFICATION"
}

const DB_MODEL_REF = {
    USER: "user",
    ROLE: 'role',
    PERMISSION: 'permission',
    BLACKLISTTOKEN: 'blacklistToken',
    COUNTRY: 'country',
    LANGUAGE: 'language',
    PUBLICATION: 'publication',
    CATEGORY: 'category',
    LOCATION: 'location',
    RSSFEED: 'rssfeed',
    CMS: 'cms',
    NEWS: 'news',
    APPLANGUAGE: 'app_language',
    TOPIC: 'topic',
    ARTICLE: 'article',
    READLATER: 'read_later',
    BUNDLE: 'bundle',
    TRENDINGSEARCH: 'trending_search',
    CONTACTUS: 'contact-us'
};

const LOOKUP_DB_NAME = {
    USER: "users",
    ROLE: 'roles',
    PERMISSION: 'permissions',
    BLACKLISTTOKEN: 'blacklistTokens',
    COUNTRY: 'countries',
    LANGUAGE: 'languages',
    PUBLICATION: 'publications',
    LOCATION: 'locations',
    CATEGORY: 'categories',
    NEWS: 'news',
    TOPIC: 'topics',
    READLATER: 'read_laters',
    ARTICLE: 'articles',
    BUNDLE: 'bundles',
    TRENDINGSEARCH: 'trending_searches'
};

const STATUS = {
    INACTIVE: "INACTIVE",
    ACTIVE: "ACTIVE",
    PENDING: "PENDING"
}
const TOPICISMAIN = {
    YES: 'YES',
    NO: 'NO'
}

const REGISTERED_VIA = {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    NORMAL: 'normal',

}
const GENDER = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHER: "OTHER"
}

const DEVICETYPE = {
    IOS: "IOS",
    ANDROID: "ANDROID",
    WEB: "WEB",
}

const UPLOAD_TYPE = {
    VIDEO: "video",
    IMAGE: "image"
}
const MESSAGES = {
    intrnlSrvrErr: "Please try after some time.",
    unAuthAccess: "Unauthorized access ",
    authAccess: "authorized access ",
    tokenGenError: "Error while generating access token",
    invalidEmail: "Please fill valid Email Address",
    emailCantEmpty: "Please fill Email Address",
    passCantEmpty: "Password can't be empty",
    invalidPassword: 'Password invalid.',
    invalidMobile: "Please fill valid Phone No",
    emptyPhoneNumber: 'Phone number is required.',
    emptyId: 'Please enter id.',
    invalidId: 'Please enter valid id.',
    alreadyOpen: 'Status already open.',
    alreadyClose: 'Status already close.',
    alreadyActive: 'Status already active.',
    alreadyInActive: 'Status already inactive.',
    changeSuccess: "Status updated successfully.",
    emptyStatus: "Please select status.",
    changeStatusErr: 'There is some issue with status change.',
    dataNotFound: "Data not found.",
    logoutSuccessfully: "Logout Successfully.",
    userNotFound: "User not found.",
    alreadyRegisteredWithSocial: 'You already registered with social media.',
    passwordMismatch: "Password mismatch",
    newAndConfPasswordNotSame: 'New & Confirm Password must be same.',
    atLeastOneField: 'Please enter atLeast one Field for edit.',
    emailSended: "Check your mail to reset your password.",
    otpRequired: 'Otp is Required.',
    otpVerified: 'Otp verified successfully.',
    resetPasswordSuccess: 'Password reset successfully.',
    appLanguageChangeSuccess: 'App language updated successfully.',
    newsLanguageChangeSuccess: 'News language updated successfully.',
    languagesNotFound: 'Languages not found.',
    invalidType: 'Type invalid.',
    updatedSuccess: 'Updated successfully.',
    listingSuccess: 'Listing successfully.',
    deleteSuccess: 'Deleted successfully.',
    issueWithList: 'There is some issue with list.',
    invalidNewPassword: 'New Password invalid.',
    typeRequired: 'Type required.',
    articleNotFound: 'Article not found.',
    readLaterArticleNotFound:"Read later article not found",
    articleIdRequired: 'Article id required.',
    articleIdInvalid: 'Article id Invalid.',
    bundleNotFound: 'Bundle not found.',
    bundleNotAccess: 'You have no permission to access this bundle',
    publicationNotFound: 'Publication not found.',
    topicNotFound: 'Topic not found',
    catagoryNotFound: 'Category not found.',
    getByIdSuccess: 'Get by id successfully.',
    issWithupdate: 'There is some issue with update.',
    invalidOtp: "Invalid OTP",
    invalidToken: "Invalid access token.",
    incorrectPass: "Invalid email or passoword",
    InternalServerError: "Internal server error.",
    ok: "Ok.",
    statusTrue: true,
    statusFalse: false,
    fileNotFound: 'File not found.',
    userInactive: 'User is inactive.',
    issWithDashboardDetail: 'There is some issue with get dashboardDetail.'
};

const PAGINATION = {
    limit: 10,
    skip: 0
}

const http_code = {
    created: 201,
    ok: 200,
    unAuthorized: 401,
    account_not_found: 302,
    dataNotFound: 404,
    forbidden: 403,
    badRequest: 400,
    internalServerError: 500,
    anotherDevice: 208
}

const BUNDLE_STATUS = {
    PUBLIC: 'public',
    PRIVATE: 'private'
}

const BUNDLE_TYPE = {
    MYBUNDLE: 'mybundles',
    SAVED: 'saved'
}

const CONTACT_STATUS = {
    OPEN: 'open',
    CLOSE: 'close'
}

const ARTICLE_LIKE_TYPE = {
    LIKE: 'like',
    DISLIKE: 'dislike'
}
const NOTIFICATION = {
    YES: 'YES',
    NO: 'NO'
}

module.exports = {
    STATUS,
    ACCOUNT_TYPE,
    LEVEL,
    STATUS_CODE,
    ACCOUNT_LEVEL,
    DB_MODEL_REF,
    MESSAGES: MESSAGES,
    LOOKUP_DB_NAME,
    CMS_TYPE,
    GENDER,
    NOTIFICATION,
    NOTIFICATION_TYPE,
    PAGINATION,
    DEVICETYPE,
    http_code,
    UPLOAD_TYPE,
    REGISTERED_VIA,
    USER_PROGRESS,
    TOPICISMAIN,
    BUNDLE_STATUS,
    BUNDLE_TYPE,
    CONTACT_STATUS,
    ARTICLE_LIKE_TYPE
}