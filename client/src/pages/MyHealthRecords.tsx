import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { apiRequest } from "@/lib/queryClient";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";

export default function MyHealthRecords() {
  // protege rota (se não logado -> redireciona)
  useAuthRedirect();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // estado do modal (abrir/fechar)
  const [open, setOpen] = useState(false);

  // se estamos editando um registro existente (senão = criação)
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  // estado do formulário
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    notes: "",
  });

  // =========================================================
  // LISTAGEM (GET /api/health-records)
  // =========================================================
  const {
    data: records,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["/api/health-records"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/health-records");
      return res.json();
    },
  });

  // =========================================================
  // CRIAÇÃO (POST /api/health-records)
  // =========================================================
  const createRecord = useMutation({
    mutationFn: async (data: typeof formData) => {
      // 👇 conversão de string → Date
      const payload = {
        ...data,
        date: new Date(data.date),
      };
      const res = await apiRequest("POST", "/api/health-records", payload);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registro criado",
        description: "Seu registro de saúde foi salvo com sucesso.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/health-records"],
      });
      // fecha modal + limpa form
      setOpen(false);
      setFormData({ title: "", date: "", notes: "" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao criar registro",
        description: "Tente novamente em instantes.",
      });
    },
  });

  // =========================================================
  // ATUALIZAÇÃO (PUT /api/health-records/:id)
  // =========================================================
  const updateRecord = useMutation({
    mutationFn: async (data: typeof formData) => {
      // 👇 conversão de string → Date
      const payload = {
        ...data,
        date: new Date(data.date),
      };
      const res = await apiRequest(
        "PUT",
        `/api/health-records/${editingRecord?.id}`,
        payload
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registro atualizado",
        description: "As informações foram salvas.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/health-records"],
      });
      setOpen(false);
      setEditingRecord(null);
      setFormData({ title: "", date: "", notes: "" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
      });
    },
  });

  // =========================================================
  // EXCLUSÃO (DELETE /api/health-records/:id)
  // =========================================================
  const deleteRecord = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/health-records/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Registro excluído",
        description: "O registro foi removido.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/health-records"],
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível remover este registro.",
      });
    },
  });

  // =========================================================
  // HANDLERS
  // =========================================================

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingRecord) {
      // modo edição
      updateRecord.mutate(formData);
    } else {
      // modo criação
      createRecord.mutate(formData);
    }
  }

  function handleNew() {
    setEditingRecord(null);
    setFormData({ title: "", date: "", notes: "" });
    setOpen(true);
  }

  function handleEdit(record: any) {
    setEditingRecord(record);
    setFormData({
      title: record.title,
      // assume que record.date é ISO string; corta pra "YYYY-MM-DD" para o input[type=date]
      date: record.date ? String(record.date).slice(0, 10) : "",
      notes: record.notes || "",
    });
    setOpen(true);
  }

  function handleDelete(record: any) {
    if (
      window.confirm(
        `Tem certeza que deseja excluir "${record.title}"?`
      )
    ) {
      deleteRecord.mutate(record.id);
    }
  }

  // =========================================================
  // ESTADOS DE LOADING / ERRO
  // =========================================================

  if (isLoading) {
    return <LoadingState message="Carregando seus registros de saúde..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar seus registros."
        description="Pode ter ocorrido um problema de conexão ou de sessão expirada."
        onRetry={() => refetch()}
      />
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Cabeçalho da página */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Meus Registros de Saúde
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Vacinas, exames e observações importantes que você quer manter
              salvos.
            </p>
          </div>

          <Button
            className="h-12 px-4 text-base font-semibold"
            onClick={handleNew}
            data-testid="button-new-record"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </div>

        {/* Lista de registros */}
        {(!records || records.length === 0) ? (
          <p className="text-muted-foreground text-lg">
            Nenhum registro encontrado.
            <br />
            Clique em <span className="font-semibold">"Novo Registro"</span>{" "}
            para adicionar seu primeiro histórico de saúde.....
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {records.map((record: any) => (
              <div
                key={record.id}
                className="p-6 rounded-xl border bg-card hover-elevate transition-shadow flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2 leading-tight">
                    {record.title}
                  </h2>

                  <div className="flex items-center text-muted-foreground mb-2 text-sm">
                    <Calendar className="h-4 w-4 mr-2 shrink-0" />
                    {record.date
                      ? format(new Date(record.date), "dd/MM/yyyy")
                      : "Sem data"}
                  </div>

                  {record.notes && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-line">
                      {record.notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(record)}
                    data-testid={`button-edit-${record.id}`}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(record)}
                    data-testid={`button-delete-${record.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {editingRecord ? "Editar Registro" : "Novo Registro"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium leading-none"
              >
                Título
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, title: e.target.value }))
                }
                required
                placeholder="Ex.: Dose de reforço COVID, Hemograma completo"
                data-testid="input-title"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="date"
                className="text-sm font-medium leading-none"
              >
                Data
              </Label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, date: e.target.value }))
                }
                required
                data-testid="input-date"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="notes"
                className="text-sm font-medium leading-none"
              >
                Observações
              </Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Ex.: Sem reação, resultado normal, encaminhado para especialista..."
                data-testid="input-notes"
              />
            </div>

            <DialogFooter className="flex gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => {
                  setOpen(false);
                  setEditingRecord(null);
                  setFormData({ title: "", date: "", notes: "" });
                }}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="flex-1 sm:flex-none"
                disabled={createRecord.isPending || updateRecord.isPending}
                data-testid="button-save"
              >
                {editingRecord ? "Salvar alterações" : "Criar registro"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
