import { Link } from 'react-router-dom';
import { Building2, Users, CreditCard, UserSquare2 } from 'lucide-react';

const menuItems = [
  { title: 'Branches', icon: Building2, url: '/manager/branches' },
  { title: 'Accounts', icon: CreditCard, url: '/manager/accounts' },
  { title: 'Customers', icon: Users, url: '/manager/customers' },
  { title: 'Employees', icon: UserSquare2, url: '/manager/employees' },
];

export function AppSidebar() {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <h1 className="text-2xl font-bold mb-6">Bank Management</h1>
        <ul>
          {menuItems.map((item) => (
            <li key={item.title} className="mb-2">
              <Link
                to={item.url}
                className="flex items-center p-2 rounded hover:bg-gray-700"
              >
                <item.icon className="mr-2 h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

