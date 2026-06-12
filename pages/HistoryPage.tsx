import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Trash2, 
  Download, 
  ExternalLink, 
  Calendar,
  Filter,
  Sparkles,
  History,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '../components/ui/dialog';
import { mockBackend } from '../lib/mock-backend';
import { User, HistoryItem } from '../types';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [user] = useState<User | null>(mockBackend.getCurrentUser());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  
  // Custom dialog state triggered for Delete actions
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setHistory(mockBackend.getHistory(user.id));
    }
  }, [user]);

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    
    // Perform standard backend removal
    mockBackend.deleteHistory(deleteConfirmId);
    setHistory(history.filter(h => h.id !== deleteConfirmId));
    setDeleteConfirmId(null);
    
    // Dispatch system events so other open tables dynamically sync their state immediately
    window.dispatchEvent(new Event('subscription_change'));

    toast.success(
      i18n.language === 'id' 
        ? "Riwayat klasifikasi berhasil dihapus selamanya." 
        : "Classification successfully removed from history"
    );
  };

  const executePDFExport = (item: HistoryItem) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("BrandVision AI: Classification Archival", 25, 25);
    
    doc.setFontSize(14);
    doc.text("Extracted Brand Summary:", 25, 45);
    doc.setFontSize(11);
    const splitSummary = doc.splitTextToSize(item.result.summary, 160);
    doc.text(splitSummary, 25, 53);

    doc.setFontSize(14);
    doc.text("Neural Expertise Classes:", 25, 90);
    doc.setFontSize(11);
    item.result.expertiseAreas.forEach((area, i) => {
      doc.text(`• ${area}`, 25, 100 + (i * 9));
    });

    doc.save(`brandvision-archive-${item.id}.pdf`);
    toast.success(
      i18n.language === 'id' 
        ? `Riwayat PDF "${item.id.substring(0,6)}" berhasil diunduh.` 
        : "PDF report exported successfully"
    );
  };

  const executeExcelExport = (item: HistoryItem) => {
    const wsData = [
      { DataKey: "History ID", Value: item.id },
      { DataKey: "Registered Date", Value: new Date(item.createdAt).toLocaleString() },
      { DataKey: "Core Brand Summary", Value: item.result.summary },
      ...item.result.expertiseAreas.map((area, index) => ({
        DataKey: `Expertise Element ${index + 1}`,
        Value: area
      }))
    ];
    
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Classifications Archive");
    XLSX.writeFile(wb, `brandvision-archive-${item.id}.xlsx`);
    
    toast.success(
      i18n.language === 'id' 
        ? "Berkas riwayat Excel berhasil diekspor." 
        : "Excel spreadsheet exported successfully"
    );
  };

  const filteredHistory = history.filter(item => 
    item.result.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.result.expertiseAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-12 text-left">
      
      {/* Search Header panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-3.5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-905 to-slate-800 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
            {i18n.language === 'id' ? "Arsip Riwayat AI" : t('history')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {i18n.language === 'id' 
              ? "Kelola, filter, dan tinjau klasifikasi spesialisasi brand yang telah dibuat sebelumnya." 
              : "Review and export your historic personal branding neural models."}
          </p>
        </div>

        {/* Input search rail */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder={i18n.language === 'id' ? "Cari riwayat..." : "Search past profiles..."} 
              className="pl-10 pr-4 h-10 w-full rounded-xl border-slate-205 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="w-10 h-10 border-slate-205 text-slate-500 hover:bg-slate-50 rounded-xl">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>      {/* Main Grid Card Container for Desktop, hidden on Mobile */}
      <Card className="hidden md:block border-none bg-white dark:bg-slate-900 shadow-sm rounded-3xl overflow-hidden mt-6">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800">
              <TableRow className="border-none">
                <TableHead className="font-bold text-xs text-slate-400 dark:text-slate-505 uppercase tracking-wider py-4 pl-6">
                  {i18n.language === 'id' ? "Ringkasan Brand" : "Brand Summary"}
                </TableHead>
                <TableHead className="font-bold text-xs text-slate-400 dark:text-slate-505 uppercase tracking-wider py-4">
                  {i18n.language === 'id' ? "Area Keahlian" : "Expertise Areas"}
                </TableHead>
                <TableHead className="font-bold text-xs text-slate-400 dark:text-slate-505 uppercase tracking-wider py-4">
                  {i18n.language === 'id' ? "Tanggal" : "Date"}
                </TableHead>
                <TableHead className="font-bold text-xs text-slate-400 dark:text-slate-505 uppercase tracking-wider py-4 text-right pr-6">
                  {i18n.language === 'id' ? "Tindakan" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredHistory.map((item) => (
                <TableRow key={item.id} className="border-none hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <TableCell className="py-4 pl-6 font-medium text-slate-800 dark:text-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-55/10 bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 border border-indigo-100/10">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="truncate max-w-[280px] font-semibold text-sm inline-block">{item.result.summary}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {item.result.expertiseAreas.slice(0, 2).map((area, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-100/80 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded-md">
                          {area}
                        </Badge>
                      ))}
                      {item.result.expertiseAreas.length > 2 && (
                        <Badge variant="outline" className="text-[10px] text-indigo-600 border-indigo-100 px-1.5 py-0.5 rounded-md">
                          +{item.result.expertiseAreas.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-slate-450 dark:text-slate-500 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setSelectedItem(item); setIsDetailsOpen(true); }}
                        className="w-8 h-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>

                      {/* PDF download shortcut */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => executePDFExport(item)}
                        className="w-8 h-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 cursor-pointer"
                        title="Download PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>

                      {/* Excel download shortcut */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => executeExcelExport(item)}
                        className="w-8 h-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-600 cursor-pointer"
                        title="Download Excel"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </Button>

                      {/* Delete shortcut trigger */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="w-8 h-8 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty state component */}
        {filteredHistory.length === 0 && (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
              <History className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
              {i18n.language === 'id' ? "Tidak Ada Riwayat" : t('no_history')}
            </h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed font-semibold">
              {i18n.language === 'id' 
                ? "Anda belum melakukan klasifikasi spesialisasi brand apa pun saat ini." 
                : "You haven't classified any professional descriptions yet."}
            </p>
            <Link to="/classify" className="mt-6 inline-block">
              <Button className="rounded-xl px-6 h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 cursor-pointer shadow-sm">
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>{i18n.language === 'id' ? "Mulai Klasifikasi" : "Start Now"}</span>
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Mobile Card-Based History List, visible only on smaller screens */}
      <div className="md:hidden space-y-4 mt-6">
        {filteredHistory.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800 p-5 rounded-2.5xl shadow-sm text-left space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 border border-indigo-100/10">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                </div>
                <p className="font-extrabold text-sm text-slate-850 dark:text-slate-100 truncate">{item.result.summary}</p>
              </div>
              <span className="text-[10px] shrink-0 font-bold bg-slate-50 dark:bg-slate-950 px-2.5 py-1 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-400 font-mono">
                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Tags layout */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.result.expertiseAreas.map((area, idx) => (
                <Badge key={idx} variant="secondary" className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded-md border-transparent">
                  {area}
                </Badge>
              ))}
            </div>

            {/* Quick action controls for mobile row */}
            <div className="flex items-center justify-end gap-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-3.5 mt-1 select-none">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setSelectedItem(item); setIsDetailsOpen(true); }}
                className="h-8.5 px-3.5 text-[10px] font-black tracking-wider uppercase text-slate-650 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                <span>{i18n.language === 'id' ? "Rincian" : "Details"}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => executePDFExport(item)}
                className="w-8.5 h-8.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-502 hover:text-indigo-600 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => executeExcelExport(item)}
                className="w-8.5 h-8.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-502 hover:text-emerald-600 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setDeleteConfirmId(item.id)}
                className="w-8.5 h-8.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-402 hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {filteredHistory.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800 py-16 px-4 rounded-2.5xl text-center space-y-4">
            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-800">
              <History className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-850 dark:text-white">{i18n.language === 'id' ? "Tidak Ada Riwayat" : t('no_history')}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">{i18n.language === 'id' ? "Anda belum mengklasifikasikan data apa pun." : "You haven't classified any data yet."}</p>
            </div>
            <Link to="/classify" className="inline-block mt-2">
              <Button size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-750 text-white font-bold">{i18n.language === 'id' ? "Klasifikasi Sekarang" : "Start now"}</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Unified modal for detailing both mobile & desktop clicks */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 text-left border-none shadow-xl mt-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-800 dark:text-white">
              {i18n.language === 'id' ? "Rincian Klasifikasi Brand" : "Classification Details"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-450 mt-1">
              Generated on {selectedItem && new Date(selectedItem.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-450">{i18n.language === 'id' ? "Teks Deskripsi Asli" : "Original Input Bio"}</h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 text-xs font-medium leading-relaxed rounded-2xl max-h-44 overflow-y-auto border border-slate-100 dark:border-slate-850 shadow-inner">
                {selectedItem?.inputText}
              </div>
            </div>
            
            <div className="space-y-2.5 font-sans">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-450">{i18n.language === 'id' ? "Ringkasan Ekstraksi AI" : "Brand Summary"}</h4>
              <p className="text-base font-bold italic leading-relaxed text-slate-855 dark:text-slate-100">
                "{selectedItem?.result.summary}"
              </p>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-455">{i18n.language === 'id' ? "Area Keahlian Pemetaan" : "Expertise Areas Mapped"}</h4>
              <div className="flex flex-wrap gap-2">
                {selectedItem?.result.expertiseAreas.map((area, i) => (
                  <Badge key={i} variant="secondary" className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-750 dark:text-indigo-400 font-extrabold px-3 py-1.5 text-xs border border-indigo-100/10 rounded-lg">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unified global Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={(open) => {
        if (!open) setDeleteConfirmId(null);
      }}>
        <DialogContent className="max-w-md rounded-2xl p-5 text-left border-none shadow-xl">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-55/10 bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0 text-red-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-md font-bold text-slate-900 dark:text-white">
                {i18n.language === 'id' ? "Hapus Riwayat Klasifikasi?" : "Are you absolutely sure?"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed font-semibold">
                {i18n.language === 'id' 
                  ? "Tindakan ini tidak dapat dibatalkan. Riwayat profil brand Anda akan terhapus selamanya dari sistem penyimpanan lokal." 
                  : "This action cannot be undone. This classification record will be permanently deleted from your local storage."}
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <DialogFooter className="flex flex-row justify-end gap-2 mt-5">
            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)} className="rounded-xl px-4 text-xs font-bold cursor-pointer">
              {i18n.language === 'id' ? "Batal" : "Cancel"}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} className="bg-red-655 hover:bg-red-700 text-white rounded-xl px-4 text-xs font-bold cursor-pointer">
              {i18n.language === 'id' ? "Ya, Hapus Data" : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryPage;
