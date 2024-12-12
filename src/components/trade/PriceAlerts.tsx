import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2 } from 'lucide-react';

interface PriceAlert {
  id: string;
  price: number;
  isAbove: boolean;
}

export function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlertPrice, setNewAlertPrice] = useState('');
  const [isAbove, setIsAbove] = useState(true);

  const addAlert = () => {
    if (!newAlertPrice) return;
    
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      price: parseFloat(newAlertPrice),
      isAbove,
    };

    setAlerts([...alerts, newAlert]);
    setNewAlertPrice('');
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Price Alerts
        </h3>
        <Bell className="w-4 h-4 text-yellow-500" />
      </div>

      <div className="flex space-x-2">
        <input
          type="number"
          value={newAlertPrice}
          onChange={(e) => setNewAlertPrice(e.target.value)}
          placeholder="Enter price"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        />
        <select
          value={isAbove ? 'above' : 'below'}
          onChange={(e) => setIsAbove(e.target.value === 'above')}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addAlert}
          className="p-2 rounded-lg bg-yellow-500 text-black"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Alert when price is {alert.isAbove ? 'above' : 'below'} ${alert.price}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeAlert(alert.id)}
              className="p-1 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}