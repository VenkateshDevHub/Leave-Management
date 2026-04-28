export interface Employee {
  id: string;
  name1: string;
  email: string;
  department: string;
  employeecode: string;
  manager?: { id: string; name1: string } | null;
}
