import api from "./api";

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
};

export const usersApi = {
  list: (params) => api.get("/users", { params }),
};

export const approvalsApi = {
  pending: (params) => api.get("/approvals/pending", { params }),
  approve: (approvalId, remarks = "") =>
    api.post(`/approvals/${approvalId}/approve`, remarks ? { remarks } : {}),
  reject: (approvalId, rejectionReason = "Rejected by admin") =>
    api.post(`/approvals/${approvalId}/reject`, { rejectionReason }),
};

export const institutesApi = {
  list: (params) => api.get("/institutes", { params }),
};

export const coursesApi = {
  list: (params) => api.get("/courses", { params }),
  create: (payload) => api.post("/courses", payload),
};

export const batchesApi = {
  list: (params) => api.get("/batches", { params }),
  create: (payload) => api.post("/batches", payload),
};

export const progressApi = {
  studentProgress: (userId) => api.get(`/progress/${userId}`),
};
