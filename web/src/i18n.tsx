import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { getLanguageLocaleFromLocalStorage } from 'src/hooks/useLanguageLocaleStorage'

export enum TranslationKeys {
  all_markers = 'all_markers',
  my_markers = 'my_markers',
  new_eco_problem = 'new_eco_problem',
  statistics = 'statistics',
  category = 'category',
  categories = 'categories',
  view_all_markers = 'view_all_markers',
  view_map = 'view_map',
  author = 'author',
  problem = 'problem',
  view_marker = 'view_marker',
  view_my_markers = 'view_my_markers',
  go_view_all_my_markers = 'go_view_all_my_markers',
  marker_is_required = 'marker_is_required',
  remove_added_marker = 'remove_added_marker',
  decline_marker = 'decline_marker',
  add_marker = 'add_marker',
  marker = 'marker',
  key_words = 'key_words',
  severity = 'severity',
  min_value = 'min_value',
  max_value = 'max_value',
  short_description = 'short_description',
  description = 'description',
  inform_about_new_ecology_problem = 'inform_about_new_ecology_problem',
  checking_is_correct_marker = 'checking_is_correct_marker',
  marker_in_this_region_is_temporary_unavailable = 'marker_in_this_region_is_temporary_unavailable',
  marker_successfully_added = 'marker_successfully_added',
  save = 'save',
  cancel = 'cancel',
  loading = 'loading',
  error = 'error',
  success = 'success',
  file_type_should_be = 'file_type_should_be',
  file_should_be_less_than = 'file_should_be_less_than',
  something_went_wrong = 'something_went_wrong',
  no_options = 'no_options',
  is_required = 'is_required',
  upload_your_file = 'upload_your_file',
  choose_file = 'choose_file',
  file_uploaded_success = 'file_uploaded_success',
  or = 'or',
  file = 'file',
  add = 'add',
  login = 'login',
  logout = 'logout',
  page = 'page',
  name = 'name',
  count_of_usage = 'count_of_usage',
  search = 'search',
  show = 'show',
  of = 'of',
  add_new = 'add_new',
  are_u_sure_to_delete = 'are_u_sure_to_delete',
  yes = 'yes',
  confirm_delete = 'confirm_delete',
  edit_category = 'edit_category',
  create_category = 'create_category',
  title = 'title',
  edit_keyword = 'edit_keyword',
  create_keyword = 'create_keyword',
  users = 'users',
  create_user = 'create_user',
  edit_user = 'edit_user',
  email = 'email',
  role = 'role',
  problems_commented = 'problems_commented',
  problems_reported = 'problems_reported',
  USER = 'USER',
  ANALYST = 'ANALYST',
  ADMIN = 'ADMIN',
  password = 'password',
  filters = 'filters',
  apply = 'apply',
  clear = 'clear',
  reset_password = 'reset_password',
  eco_problems = 'eco_problems',
  edit_problem = 'edit_problem',
  create_problem = 'create_problem',
  status = 'status',
  votes_count = 'votes_count',
  comments_count = 'comments_count',
  created_at = 'created_at',
  last_update_at = 'last_update_at',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}
const UATranslation: { [key in TranslationKeys]: string } = {
  [TranslationKeys.all_markers]: 'Всі мітки',
  [TranslationKeys.my_markers]: 'Мої мітки',
  [TranslationKeys.new_eco_problem]: 'Нова еко-проблема',
  [TranslationKeys.statistics]: 'Статистика',
  [TranslationKeys.category]: 'Категорія',
  [TranslationKeys.categories]: 'Категорії',
  [TranslationKeys.view_all_markers]: 'Перегляд усіх міток',
  [TranslationKeys.view_map]: 'Перегляд карти',
  [TranslationKeys.author]: 'Автор',
  [TranslationKeys.problem]: 'Проблема',
  [TranslationKeys.view_marker]: 'Перегляд мітки',
  [TranslationKeys.view_my_markers]: 'Перегляд моїх міток',
  [TranslationKeys.go_view_all_my_markers]: 'Переглянути всі мої мітки',
  [TranslationKeys.marker_is_required]: "Мітка обов'язкова",
  [TranslationKeys.remove_added_marker]: 'Видалити додану мітку',
  [TranslationKeys.decline_marker]: 'Відмінити мітку',
  [TranslationKeys.add_marker]: 'Додати мітку',
  [TranslationKeys.marker]: 'Мітка',
  [TranslationKeys.key_words]: 'Ключові слова',
  [TranslationKeys.severity]: 'Важливість',
  [TranslationKeys.min_value]: 'Мінімальне значення',
  [TranslationKeys.max_value]: 'Максимальне значення',
  [TranslationKeys.short_description]: 'Короткий опис',
  [TranslationKeys.description]: 'Опис',
  [TranslationKeys.inform_about_new_ecology_problem]:
    'Проінформувати про нову екологічну проблему',
  [TranslationKeys.checking_is_correct_marker]:
    'Перевіряється коректність мітки',
  [TranslationKeys.marker_in_this_region_is_temporary_unavailable]:
    'Мітка в даному регіоні тимчасово недоступна',
  [TranslationKeys.marker_successfully_added]: 'Мітку успішно додано',
  [TranslationKeys.save]: 'Зберегти',
  [TranslationKeys.cancel]: 'Відмінити',
  [TranslationKeys.loading]: 'Завантаження',
  [TranslationKeys.error]: 'Помилка',
  [TranslationKeys.success]: 'Успіх',
  [TranslationKeys.file_type_should_be]: 'Розширення файлу повинне бути',
  [TranslationKeys.file_should_be_less_than]: 'Розмір файлу повинен бути менше',
  [TranslationKeys.something_went_wrong]: 'Щось пішло не так',
  [TranslationKeys.no_options]: 'Немає варіантів',
  [TranslationKeys.is_required]: 'є обовʼязковим полем',
  [TranslationKeys.upload_your_file]: 'Завантажуйте ваш файл',
  [TranslationKeys.choose_file]: 'Обрати файл',
  [TranslationKeys.file_uploaded_success]: 'Файл успішно завантажено',
  [TranslationKeys.or]: 'або',
  [TranslationKeys.file]: 'файл',
  [TranslationKeys.add]: 'додайте',
  [TranslationKeys.login]: 'Увійти',
  [TranslationKeys.logout]: 'Вийти',
  [TranslationKeys.page]: 'Сторінка',
  [TranslationKeys.name]: "Ім'я",
  [TranslationKeys.count_of_usage]: 'Кількість використань',
  [TranslationKeys.search]: 'Пошук',
  [TranslationKeys.show]: 'Показати',
  [TranslationKeys.of]: 'з',
  [TranslationKeys.add_new]: 'Додати',
  [TranslationKeys.are_u_sure_to_delete]: 'Ви впевнені, що хочете видалити',
  [TranslationKeys.yes]: 'Так',
  [TranslationKeys.confirm_delete]: 'Підтвердіть видалення',
  [TranslationKeys.create_category]: 'Створення категорії',
  [TranslationKeys.edit_category]: 'Редагування категорії',
  [TranslationKeys.title]: 'Заголовок',
  [TranslationKeys.edit_keyword]: 'Редагування ключового слова',
  [TranslationKeys.create_keyword]: 'Створення ключового слова',
  [TranslationKeys.users]: 'Користувачі',
  [TranslationKeys.create_user]: 'Створення користувача',
  [TranslationKeys.edit_user]: 'Редагування користувача',
  [TranslationKeys.email]: 'Пошта',
  [TranslationKeys.role]: 'Роль',
  [TranslationKeys.problems_commented]: 'Проблем прокоментовано',
  [TranslationKeys.problems_reported]: 'Розпочато проблем',
  [TranslationKeys.USER]: 'Користувач',
  [TranslationKeys.ANALYST]: 'Аналітик',
  [TranslationKeys.ADMIN]: 'Адмін',
  [TranslationKeys.password]: 'Пароль',
  [TranslationKeys.filters]: 'Фільтри',
  [TranslationKeys.apply]: 'Застосувати',
  [TranslationKeys.clear]: 'Очистити',
  [TranslationKeys.reset_password]: 'Скидання паролю',
  [TranslationKeys.eco_problems]: 'Екологічні проблеми',
  [TranslationKeys.edit_problem]: 'Редагування еко-проблеми',
  [TranslationKeys.create_problem]: 'Створення еко-проблеми',
  [TranslationKeys.status]: 'Статус',
  [TranslationKeys.votes_count]: 'Кількість використань',
  [TranslationKeys.comments_count]: 'Кількість коментарів',
  [TranslationKeys.created_at]: 'Створено',
  [TranslationKeys.last_update_at]: 'Остання зміна',
  [TranslationKeys.OPEN]: 'Відкрито',
  [TranslationKeys.IN_PROGRESS]: 'В процесі',
  [TranslationKeys.RESOLVED]: 'Виконано',
  [TranslationKeys.REJECTED]: 'Відхилено',
}

const ENTranslation: { [key in TranslationKeys]: string } = {
  [TranslationKeys.all_markers]: 'All markers',
  [TranslationKeys.my_markers]: 'My markers',
  [TranslationKeys.new_eco_problem]: 'New eco-problem',
  [TranslationKeys.statistics]: 'Statistics',
  [TranslationKeys.category]: 'Category',
  [TranslationKeys.categories]: 'Categories',
  [TranslationKeys.view_all_markers]: 'View all markers',
  [TranslationKeys.view_map]: 'View map',
  [TranslationKeys.author]: 'Author',
  [TranslationKeys.problem]: 'Problem',
  [TranslationKeys.view_marker]: 'View marker',
  [TranslationKeys.view_my_markers]: 'View my markers',
  [TranslationKeys.go_view_all_my_markers]: 'View all my markers',
  [TranslationKeys.marker_is_required]: 'Marker is required',
  [TranslationKeys.remove_added_marker]: 'Remove added marker',
  [TranslationKeys.decline_marker]: 'Cancel marker',
  [TranslationKeys.add_marker]: 'Add marker',
  [TranslationKeys.marker]: 'Marker',
  [TranslationKeys.key_words]: 'Keywords',
  [TranslationKeys.severity]: 'Severity',
  [TranslationKeys.min_value]: 'Min value',
  [TranslationKeys.max_value]: 'Max value',
  [TranslationKeys.short_description]: 'Short description',
  [TranslationKeys.description]: 'Description',
  [TranslationKeys.inform_about_new_ecology_problem]:
    'Inform about new ecology problem',
  [TranslationKeys.checking_is_correct_marker]:
    'Checking the correctness of the marker',
  [TranslationKeys.marker_in_this_region_is_temporary_unavailable]:
    'Marker in this region is temporary unavailable',
  [TranslationKeys.marker_successfully_added]: 'Marker successfully added',
  [TranslationKeys.save]: 'Save',
  [TranslationKeys.cancel]: 'Cancel',
  [TranslationKeys.loading]: 'Loading',
  [TranslationKeys.error]: 'Error',
  [TranslationKeys.success]: 'Success',
  [TranslationKeys.file_type_should_be]: 'File type should be',
  [TranslationKeys.file_should_be_less_than]: 'File size should be less than',
  [TranslationKeys.something_went_wrong]: 'Something went wrong',
  [TranslationKeys.no_options]: 'No options',
  [TranslationKeys.is_required]: 'is required',
  [TranslationKeys.upload_your_file]: 'Upload your file',
  [TranslationKeys.choose_file]: 'Choose file',
  [TranslationKeys.file_uploaded_success]: 'File uploaded successfully',
  [TranslationKeys.or]: 'or',
  [TranslationKeys.file]: 'file',
  [TranslationKeys.add]: 'add',
  [TranslationKeys.login]: 'Login',
  [TranslationKeys.logout]: 'Logout',
  [TranslationKeys.page]: 'Page',
  [TranslationKeys.name]: 'Name',
  [TranslationKeys.count_of_usage]: 'Count of usage',
  [TranslationKeys.search]: 'Search',
  [TranslationKeys.show]: 'Show',
  [TranslationKeys.of]: 'of',
  [TranslationKeys.add_new]: 'New',
  [TranslationKeys.are_u_sure_to_delete]: 'Are you sure you want to delete',
  [TranslationKeys.yes]: 'Yes',
  [TranslationKeys.confirm_delete]: 'Confirm delete',
  [TranslationKeys.create_category]: 'Create category',
  [TranslationKeys.edit_category]: 'Edit category',
  [TranslationKeys.title]: 'Title',
  [TranslationKeys.edit_keyword]: 'Edit keyword',
  [TranslationKeys.create_keyword]: 'Create keyword',
  [TranslationKeys.users]: 'Users',
  [TranslationKeys.create_user]: 'Create user',
  [TranslationKeys.edit_user]: ' Edit user',
  [TranslationKeys.email]: 'Email',
  [TranslationKeys.role]: 'Role',
  [TranslationKeys.problems_commented]: 'Problems commented',
  [TranslationKeys.problems_reported]: 'Problems reported',
  [TranslationKeys.USER]: 'User',
  [TranslationKeys.ANALYST]: 'Analyst',
  [TranslationKeys.ADMIN]: 'Admin',
  [TranslationKeys.password]: 'Password',
  [TranslationKeys.filters]: 'Filters',
  [TranslationKeys.apply]: 'Apply',
  [TranslationKeys.clear]: 'Clear',
  [TranslationKeys.reset_password]: 'Reset Password',
  [TranslationKeys.eco_problems]: 'Ecology Problems',
  [TranslationKeys.edit_problem]: 'Edit eco-problem',
  [TranslationKeys.create_problem]: 'Create eco-problem',
  [TranslationKeys.status]: 'Status',
  [TranslationKeys.votes_count]: 'Votes count',
  [TranslationKeys.comments_count]: 'Comments count',
  [TranslationKeys.created_at]: 'Created at',
  [TranslationKeys.last_update_at]: 'Last update at',
  [TranslationKeys.OPEN]: 'Open',
  [TranslationKeys.IN_PROGRESS]: 'In progress',
  [TranslationKeys.RESOLVED]: 'Resolved',
  [TranslationKeys.REJECTED]: 'Rejected',
}

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: getLanguageLocaleFromLocalStorage(),
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: ENTranslation,
    },
    ua: {
      translation: UATranslation,
    },
  },
})

export default i18n
