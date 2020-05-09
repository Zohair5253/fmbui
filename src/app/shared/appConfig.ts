// export const apiBaseUrl: string = "https://localhost:5001/api";
// export const apiBaseUrl: string = "http://fmbtestapi.azurewebsites.net/api";
export const apiBaseUrl: string = "https://fmbapi.herokuapp.com/api";

export const consumerRoutes = {
  Base: "consumer",
  List: "list",
  Add: "create",
  Update: "update"
};

export const consumerAccountRoutes = {
  Base: "consumerAccount",
  List: "list",
  Add: "create",
  View: "view",
  Update: "update"
};

export const receiptRoutes = {
  Base: "receipt",
  List: "list",
  Add: "create",
  Update: "update",
  Print:"print"
};

export const deliveryManRoutes = {
  Base: "deliveryman",
  List: "list",
  Add: "create",
  Update: "update"
};

export const commonRoutes = {
  Login: "login",
  Register: "register",
  ForgotPassword: "forgot-password",
  Home: "Home"
};

export const Areas: any = [
  { id: "Qutbi", text: "Qutbi" },
  { id: "Noor", text: "Noor" },
  { id: "Sadar", text: "Sadar" }

];

export const PaymentModes: any = [
  { id: "Cash", text: "Cash" },
  { id: "Credit\\Debit Card", text: "Credit\Debit Card" },
  { id: "Net Banking", text: "Net Banking" }

];

export const tiffinSize: any = [
  { id: "Small", text: "Small" },
  { id: "Medium", text: "Medium" },
  { id: "Big", text: "Big" }
];

export const startYear:number = 2019;

