import { useState } from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Help from '@/components/common/Help';
import DashboardExplanation from './dashboard-explanation';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardHeader() {
  const [openAction, setOpenAction] = useState(false);

  return (
    <>
      <CardHeader className="sm:mb-12">
        <CardTitle className="flex justify-between items-center gap-2">
          <p>Dashboard</p>
          {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
        </CardTitle>
        <CardDescription>
          Everything you need, right at your fingertips.
        </CardDescription>
      </CardHeader>
      <AnimatePresence>
        {openAction ? (
          <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          >
            <div className="mb-12">
              <DashboardExplanation setOpenAction={setOpenAction} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
