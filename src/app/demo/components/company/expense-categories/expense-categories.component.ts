import { Component } from '@angular/core';
import { ArticleFamily } from 'src/app/demo/data/enum/articleFamily';
import { SubCategoryType } from 'src/app/demo/data/enum/subCategoryType';
import { EQUIPMENT_PURCHASE_SUBCATEGORIES, EXPENSE_CATEGORIES, TOOL_PURCHASE_SUBCATEGORIES } from 'src/app/demo/data/expenseCategories';

interface SubCategoryView {
  label: string;
  createsEquipment: boolean;
  createsTool: boolean;
  goesToStock: boolean;
}

interface CategoryView {
  label: string;
  subCategories: SubCategoryView[];
}

// Consulta das categorias e subcategorias de despesa (as mesmas do formulário de despesas)
@Component({
  templateUrl: './expense-categories.component.html'
})
export class ExpenseCategoriesComponent {

  search: string = '';

  readonly categories: CategoryView[] = Object.entries(EXPENSE_CATEGORIES).map(([label, subCategories]) => ({
    label,
    subCategories: subCategories.map(subCategory => this.toView(subCategory))
  }));

  get totalSubCategories(): number {
    return this.categories.reduce((sum, category) => sum + category.subCategories.length, 0);
  }

  // Categorias filtradas pela pesquisa: mostra a categoria inteira se o nome dela coincidir, senão só as subcategorias que coincidem
  get filteredCategories(): CategoryView[] {
    const query = this.normalize(this.search);
    if (!query) return this.categories;

    return this.categories
      .map(category => this.normalize(category.label).includes(query)
        ? category
        : { ...category, subCategories: category.subCategories.filter(sub => this.normalize(sub.label).includes(query)) })
      .filter(category => category.subCategories.length > 0);
  }

  private toView(subCategory: SubCategoryType): SubCategoryView {
    const key = Object.keys(SubCategoryType).find(k => (SubCategoryType as any)[k] === subCategory) ?? '';
    return {
      label: subCategory,
      createsEquipment: EQUIPMENT_PURCHASE_SUBCATEGORIES.includes(subCategory),
      createsTool: TOOL_PURCHASE_SUBCATEGORIES.includes(subCategory),
      // As linhas destas subcategorias criam artigos em stock (há uma família de artigos com o mesmo nome)
      goesToStock: Object.keys(ArticleFamily).includes(key)
    };
  }

  private normalize(value: string): string {
    return (value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }
}
