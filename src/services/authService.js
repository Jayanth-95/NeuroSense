// ─── Auth Service ─────────────────────────────────────────────────────────────
// Simulates backend auth with localStorage.
// Supports extended user profile: age, gender, occupation.

const USERS_KEY        = 'neurosense_users';
const TOKEN_KEY        = 'neurosense_token';
const CURRENT_USER_KEY = 'neurosense_current_user';

const loadUsers  = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; } };
const saveUsers  = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
const genToken   = (email) => btoa(`${email}:${Date.now()}:neurosense`);

const toSafeUser = (u) => ({
  id:         u.id,
  name:       u.name,
  email:      u.email,
  age:        u.age,
  gender:     u.gender     || '',
  occupation: u.occupation || '',
  createdAt:  u.createdAt,
});

export const registerUser = ({ name, email, password, age, gender, occupation }) => {
  const users = loadUsers();
  if (users.find((u) => u.email === email))
    return { success: false, message: 'An account with this email already exists.' };

  const newUser = {
    id:         `user_${Date.now()}`,
    name,
    email,
    password,
    age:        Number(age),
    gender:     gender     || '',
    occupation: occupation || '',
    createdAt:  new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  const token    = genToken(email);
  const safeUser = toSafeUser(newUser);
  localStorage.setItem(TOKEN_KEY,        token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return { success: true, message: 'Account created.', user: safeUser, token };
};

export const loginUser = ({ email, password }) => {
  const found = loadUsers().find((u) => u.email === email && u.password === password);
  if (!found) return { success: false, message: 'Invalid email or password.' };

  const token    = genToken(email);
  const safeUser = toSafeUser(found);
  localStorage.setItem(TOKEN_KEY,        token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return { success: true, message: 'Login successful.', user: safeUser, token };
};

export const updateUserProfile = (userId, updates) => {
  const users = loadUsers();
  const idx   = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { success: false, message: 'User not found.' };

  const { password: _pw, id: _id, ...safeUpdates } = updates;
  users[idx] = { ...users[idx], ...safeUpdates };
  saveUsers(users);

  const safeUser = toSafeUser(users[idx]);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return { success: true, user: safeUser };
};

export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentSession = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user  = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (token && user) return { user, token };
  } catch { logoutUser(); }
  return { user: null, token: null };
};
